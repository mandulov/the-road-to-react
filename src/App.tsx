import {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

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
  console.log(`"${ListItem.name}" renders.`);

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
  console.log(`"${List.name}" renders.`);

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

interface InputWithLabelProps {
  id: string;
  label: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel: FC<InputWithLabelProps> = ({ id, label, value, type = "text", onInputChange }) => {
  console.log(`"${InputWithLabel.name}" renders.`);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(handleChange.name);
    console.log("event", event); // synthetic event
    onInputChange(event);
  };

  return (
    <Fragment>
      <label htmlFor={id}>{label}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
      />
    </Fragment>
  );
};

const useStorageState = (key: string, fallbackValue: string): [string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState(localStorage.getItem(key) || fallbackValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const App: FC = () => {
  console.log(`"${App.name}" renders.`);

  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

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

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(handleSearch.name);
    setSearchTerm(event.target.value);
  };

  const foundStories: Story[] = stories.filter((story: Story) => story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" label="Search:" value={searchTerm} onInputChange={handleSearch} />
      <p>
        Searching for <strong>"{searchTerm}"</strong>.
      </p>

      <hr />

      <List list={foundStories} />
    </div>
  );
};

export default App;
