import { FC, memo } from "react";

import { Story } from "../../models";
import { StyledButtonSmall, StyledColumn, StyledItem } from "./ListItem.styled";

export interface ListItemProps {
  item: Story;
  onRemoveItem: (item: Story) => void;
}

export const ListItem: FC<ListItemProps> = memo(({ item, onRemoveItem }) => {
  console.log(`"ListItem" renders.`);

  return (
    <StyledItem>
      <StyledColumn width="40%">
        <a href={item.url} target="_blank">
          {item.title}
        </a>
      </StyledColumn>
      <StyledColumn width="30%">{item.author}</StyledColumn>
      <StyledColumn width="10%">{item.num_comments}</StyledColumn>
      <StyledColumn width="10%">{item.points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>Remove</StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
});
