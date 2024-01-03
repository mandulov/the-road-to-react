import {
  ChangeEvent,
  FC,
  FocusEvent,
  Fragment,
  ReactNode,
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

interface SearchProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

const Search: FC<SearchProps> = ({ onSearch, searchTerm }) => {
  console.log(`"${Search.name}" renders.`);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("event", event); // synthetic event
    console.log("event.target.value", event.target.value);

    onSearch(event);
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
        value={searchTerm}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <p>
        Searching for <strong>"{searchTerm}"</strong>.
      </p>
    </Fragment>
  );
};

const App: FC = () => {
  console.log(`"${App.name}" renders.`);

  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "React");

  useEffect(() => {
    console.log("useEffect");
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

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
    console.log("event.target.value", event.target.value);

    setSearchTerm(event.target.value);
  };

  const foundStories: Story[] = stories.filter((story: Story) => story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={foundStories} />
    </div>
  );
};

export default App;
