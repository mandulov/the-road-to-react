import { FC, ReactNode, memo } from "react";

import { Story } from "../../models";
import { ListItem } from "../ListItem";

export interface ListProps {
  list: Story[];
  onRemoveItem: (item: Story) => void;
}

export const List: FC<ListProps> = memo(({ list, onRemoveItem }) => {
  console.log(`"List" renders.`);

  return (
    <ul>
      {/* if array items do not have an unique value, */}
      {/* their indices could be used as a last resort, */}
      {/* given that the order of the items in the array doesn't change */}
      {list.map(
        (item: Story): ReactNode => (
          <ListItem key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        )
      )}
    </ul>
  );
});
