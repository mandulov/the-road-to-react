import { ChangeEvent, FC, Fragment, HTMLInputTypeAttribute, PropsWithChildren } from "react";

import { StyledInput, StyledLabel } from "./InputWithLabel.styled";

export interface InputWithLabelProps extends PropsWithChildren {
  id: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  isFocused?: boolean;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputWithLabel: FC<InputWithLabelProps> = ({ id, value, type = "text", isFocused = false, onInputChange, children }) => {
  console.log(`"${InputWithLabel.name}" renders.`);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(handleChange.name);
    console.log("event", event); // synthetic event
    onInputChange(event);
  };

  return (
    <Fragment>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={handleChange}
      />
    </Fragment>
  );
};
