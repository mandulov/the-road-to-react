import {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  HTMLInputTypeAttribute,
  PropsWithChildren,
  ReactNode,
  Reducer,
  SetStateAction,
  useEffect,
  useReducer,
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
  onRemoveItem: (item: Story) => void;
}

const ListItem: FC<ListItemProps> = ({ item, onRemoveItem }) => {
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
      <span>
        <button onClick={() => onRemoveItem(item)}>Remove</button>
      </span>
    </li>
  );
};

interface ListProps {
  list: Story[];
  onRemoveItem: (item: Story) => void;
}

const List: FC<ListProps> = ({ list, onRemoveItem }) => {
  console.log(`"${List.name}" renders.`);

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
};

interface InputWithLabelProps extends PropsWithChildren {
  id: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  isFocused?: boolean;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel: FC<InputWithLabelProps> = ({ id, value, type = "text", isFocused = false, onInputChange, children }) => {
  console.log(`"${InputWithLabel.name}" renders.`);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(handleChange.name);
    console.log("event", event); // synthetic event
    onInputChange(event);
  };

  return (
    <Fragment>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
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

const initialStories: Story[] = [
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

const fetchResponse = { data: { stories: initialStories } } as const;
type FetchResponse = typeof fetchResponse;
const fetchStories = () => new Promise<FetchResponse>((resolve) => {
  setTimeout(() => resolve(fetchResponse), 2000);
});

//https://redux.js.org/style-guide/#model-actions-as-events-not-setters
enum StoriesActionType {
  STORIES_UPDATED = "STORIES_UPDATED",
  STORY_DELETED = "STORY_DELETED",
}

interface BaseStoriesAction<T extends StoriesActionType, U> {
  readonly type: T;
  readonly payload: U;
}

type StoriesUpdatedAction = BaseStoriesAction<typeof StoriesActionType.STORIES_UPDATED, Story[]>;
type StoryDeletedAction = BaseStoriesAction<typeof StoriesActionType.STORY_DELETED, Story>;

type StoriesAction = StoriesUpdatedAction | StoryDeletedAction;

interface StoriesState {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
}

const storiesReducer: Reducer<StoriesState, StoriesAction> = (state, action) => {
  switch (action.type) {
    case StoriesActionType.STORIES_UPDATED:
      return {
        ...state,
        data: action.payload,
      };
    case StoriesActionType.STORY_DELETED: {
      const updatedStories: Story[] = state.data.filter((story: Story): boolean => story !== action.payload);
      return {
        ...state,
        data: updatedStories,
      };
    }
    default:
      throw new Error(`Unknown action type "${(action as any).type}".`);
  }
};

const App: FC = () => {
  console.log(`"${App.name}" renders.`);

  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

  useEffect(() => {
    // https://github.com/facebook/react/issues/14326#issuecomment-441680293
    let wasFetchingCancelled = false;

    const getStories = async () => {
      setIsLoading(true);
      try {
        const fetchedStories: Story[] = (await fetchStories()).data.stories;

        if (!wasFetchingCancelled) {
          dispatchStories({
            type: StoriesActionType.STORIES_UPDATED,
            payload: fetchedStories,
          });
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getStories();

    return () => {
      wasFetchingCancelled = true;
    };
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(handleSearch.name);
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (story: Story): void => {
    dispatchStories({
      type: StoriesActionType.STORY_DELETED,
      payload: story,
    });
  };

  const foundStories: Story[] = stories.data.filter((story: Story) => story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
        <strong>Search:</strong>
      </InputWithLabel>
      <p>
        Searching for <strong>"{searchTerm}"</strong>.
      </p>

      <hr />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={foundStories} onRemoveItem={handleRemoveStory} />
      )
      }
    </div>
  );
};

export default App;
