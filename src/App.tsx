import { ChangeEvent, FC, FocusEvent, Fragment, ReactNode } from "react";

interface Story {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

interface ListItemProps {
  item: Story;
}

const ListItem: FC<ListItemProps> = ({ item }) => {
  return (
    <li key={item.objectID}>
      <span>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
};

interface ListProps {
  list: Story[];
}

const List: FC<ListProps> = ({ list }) => {
  return (
    <ul>
      {/* if array items do not have an unique value, */}
      {/* their indices could be used as a last resort, */}
      {/* given that the order of the items in the array doesn't change */}
      {list.map(
        (item: Story): ReactNode => (
          <ListItem key={item.objectID} item={item} />
        )
      )}
    </ul>
  );
};

const Search: FC = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("event", event); // synthetic event
    console.log("event.target.value", event.target.value);
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    console.log("event", event); // synthetic event
  };

  return (
    <Fragment>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Fragment>
  );
};

const App: FC = () => {
  const stories: Story[] = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search />

      <hr />

      <List list={stories} />
    </div>
  );
};

export default App;
