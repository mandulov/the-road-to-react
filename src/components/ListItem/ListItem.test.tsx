import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Story } from '../../models';
import { ListItem, ListItemProps } from "./ListItem";

const STORY_ONE: Story = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

describe('ListItem', () => {
  const DUMMY_PROPS: ListItemProps = {
    item: STORY_ONE,
    onRemoveItem: vi.fn(),
  }

  it('SHOULD render all properties', () => {
    render(<ListItem {...DUMMY_PROPS} />);
    // screen.debug();

    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute('href', 'https://reactjs.org/');
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  const REMOVE_BUTTON_VALUE = 'Remove';
  const getRemoveButton = (): HTMLElement => {
    const namePattern = new RegExp(`^${REMOVE_BUTTON_VALUE}$`);
    return screen.getByRole('button', { name: namePattern });
  };

  it(`SHOULD render a clickable "${REMOVE_BUTTON_VALUE}" button`, () => {
    render(<ListItem {...DUMMY_PROPS} />);

    // screen.getByRole(''); // react-testing-library dislays accessible roles if there is no match
    expect(getRemoveButton()).toBeInTheDocument();
  });

  it(`SHOULD the callback handler WHEN the "${REMOVE_BUTTON_VALUE}" button is clicked`, () => {
    const handleRemoveItem: (item: Story) => void = vi.fn();
    render(<ListItem  {...{ ...DUMMY_PROPS, onRemoveItem: handleRemoveItem }} />);

    fireEvent.click(getRemoveButton());

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(STORY_ONE);
  });
});
