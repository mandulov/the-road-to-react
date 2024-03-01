import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Story } from '../../models';
import { List, ListProps } from './List';

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

describe('List', () => {
  const DUMMY_PROPS: ListProps = {
    list: [],
    onRemoveItem: vi.fn(),
  };
  const getList = (): HTMLElement => screen.getByRole('list');

  it('SHOULD render all properties', () => {
    const stories: Story[] = [STORY_ONE, STORY_TWO];
    render(<List {...{ ...DUMMY_PROPS, list: stories }} />);
    screen.debug();

    const list: HTMLElement = getList();
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(stories.length);
  });

  it('SHOULD render an empty list WHEN list prop is empty', () => {
    render(<List {...DUMMY_PROPS} />);

    const list: HTMLElement = getList();
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });
});
