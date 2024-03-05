import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

import { Story } from '../models';
import App from './App';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('axios');

const STORY_ONE: Story = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const STORY_TWO: Story = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

describe(App.name, () => {
  const LOADING_LABEL_PATTERN = /Loading/;
  const REMOVE_BUTTON_VALUE = 'Remove';
  const getRemoveButtons = (): HTMLElement[] => {
    const namePattern = new RegExp(`^${REMOVE_BUTTON_VALUE}$`);
    return screen.getAllByRole('button', { name: namePattern });
  };

  it('WHEN fetching data succeeds', async () => {
    const stories: Story[] = [STORY_ONE, STORY_TWO];
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    vi.mocked(axios, true).get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(LOADING_LABEL_PATTERN)).toBeInTheDocument();

    await waitFor(() => promise);

    expect(screen.queryByText(LOADING_LABEL_PATTERN)).toBeNull(); // "getByText" would produce an error
    expect(screen.getByText(stories[0].title)).toBeInTheDocument();
    expect(screen.getByText(stories[1].title)).toBeInTheDocument();
    expect(getRemoveButtons().length).toBe(2);
  });

  it('WHEN fetching data fails', async () => {
    const promise = Promise.reject();
    vi.mocked(axios, true).get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(LOADING_LABEL_PATTERN)).toBeInTheDocument();

    try {
      await waitFor(() => promise, { timeout: 0 });
    } catch {
      expect(screen.queryByText(LOADING_LABEL_PATTERN)).toBeNull();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    }
  });

  it('WHEN a story is removed', async () => {
    const stories: Story[] = [STORY_ONE, STORY_TWO];
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    vi.mocked(axios, true).get.mockImplementationOnce(() => promise);

    render(<App />);
    await waitFor(() => promise);

    expect(getRemoveButtons().length).toBe(2);
    expect(screen.getByText(stories[0].author)).toBeInTheDocument();

    fireEvent.click(getRemoveButtons()[0]);

    expect(getRemoveButtons().length).toBe(1);
    expect(screen.queryByText(stories[0].author)).toBeNull();
  });

  it('WHEN search term is changed', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: [STORY_ONE],
      },
    });
    const reduxPromise = Promise.resolve({
      data: {
        hits: [STORY_TWO],
      },
    });
    vi.mocked(axios, true).get.mockImplementation((url: string) => {
      if (url.includes(STORY_ONE.title)) {
        return reactPromise;
      }

      if (url.includes(STORY_TWO.title)) {
        return reduxPromise;
      }

      throw new Error(`Unhandled URL "${url}".`);
    });

    render(<App />);

    expect(screen.queryByDisplayValue(STORY_ONE.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(STORY_TWO.title)).toBeNull();

    await waitFor(() => reactPromise);

    expect(screen.getByText(STORY_ONE.author)).toBeInTheDocument();
    expect(screen.queryByText(STORY_TWO.author)).toBeNull();

    fireEvent.change(screen.queryByDisplayValue(STORY_ONE.title)!, {
      target: {
        value: STORY_TWO.title,
      },
    });

    expect(screen.queryByDisplayValue(STORY_ONE.title)).toBeNull();
    expect(screen.queryByDisplayValue(STORY_TWO.title)).toBeInTheDocument();

    await waitFor(() => reduxPromise);

    expect(screen.queryByText(STORY_ONE.author)).toBeNull();
    expect(screen.getByText(STORY_TWO.author)).toBeInTheDocument();
  });
});
