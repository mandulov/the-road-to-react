import { render, screen, fireEvent } from '@testing-library/react';
import { ChangeEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { InputWithLabel, InputWithLabelProps } from "./InputWithLabel";

describe(InputWithLabel.name, () => {
  const DUMMY_PROPS: InputWithLabelProps = {
    id: 'dummy_id',
    value: 'dummy_value',
    type: 'dummy_type',
    isFocused: true,
    onInputChange: vi.fn(),
  };

  const getInputElement = (): HTMLElement => screen.getByRole('textbox');

  it('SHOULD render all properties', () => {
    const label = 'dummy_label';
    render(<InputWithLabel {...DUMMY_PROPS}>{label}</InputWithLabel>);

    expect(screen.getByText(label)).toHaveAttribute('for', DUMMY_PROPS.id);
    const inputElement: HTMLElement = getInputElement();
    expect(inputElement).toHaveAttribute('id', DUMMY_PROPS.id);
    expect(inputElement).toHaveAttribute('value', DUMMY_PROPS.value);
    expect(inputElement).toHaveAttribute('type', DUMMY_PROPS.type);
    expect(inputElement).toHaveFocus();
  });

  it('SHOULD set "type" to "text" WHEN not specified', () => {
    const { type, ...rest } = DUMMY_PROPS;
    render(<InputWithLabel {...rest}></InputWithLabel>);

    expect(getInputElement()).toHaveAttribute('type', 'text');
  });

  it('SHOULD set "isFocused" to "false" WHEN not specified', () => {
    const { isFocused, ...rest } = DUMMY_PROPS;
    render(<InputWithLabel {...rest}></InputWithLabel>);

    expect(getInputElement()).not.toHaveFocus();
  });

  it('SHOULD the callback handler WHEN the input value changes', () => {
    const handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void = vi.fn();
    render(<InputWithLabel {...{ ...DUMMY_PROPS, onInputChange: handleInputChange }}></InputWithLabel>);

    fireEvent.change(getInputElement(), { target: { value: 'React' } });

    expect(handleInputChange).toHaveBeenCalledTimes(1);
  });
});
