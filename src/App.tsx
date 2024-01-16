import axios, { AxiosResponse } from "axios";
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
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";

import "./App.css";

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
    <li className="item">
      <span style={{ width: "40%" }}>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button className="button button_small" type="button" onClick={() => onRemoveItem(item)}>Remove</button>
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
      <label className="label" htmlFor={id}>{children}</label>
      &nbsp;
      <input
        className="input"
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

const isObject = (obj: unknown): obj is object => obj === Object(obj);
const STORIES_PROP_NAME = "hits";
const isValidResponseBody = (body: unknown): body is { [STORIES_PROP_NAME]: Story[] } => isObject(body) && STORIES_PROP_NAME in body;

const HN_API_BASE_URL = "https://hn.algolia.com"
const fetchStories = (query: string): Promise<Story[]> => axios.get(`${HN_API_BASE_URL}/api/v1/search?query=${query}`)
  .then((res: AxiosResponse<unknown>): unknown => res.data)
  .then((body: unknown): Story[] => {
    if (isValidResponseBody(body)) {
      return body.hits;
    }

    throw new TypeError("Invalid response body.");
  });

//https://redux.js.org/style-guide/#model-actions-as-events-not-setters
enum StoriesActionType {
  STORY_DELETED = "STORY_DELETED",
  FETCHING_STORIES_INITIALIZED = "FETCHING_STORIES_INITIALIZED",
  FETCHING_STORIES_SUCCEEDED = "FETCHING_STORIES_SUCCEEDED",
  FETCHING_STORIES_FAILED = "FETCHING_STORIES_FAILED",
}

type BaseStoriesAction<T extends StoriesActionType, U = void> = U extends void ? {
  readonly type: T;
} : {
  readonly type: T;
  readonly payload: U;
}

type StoryDeletedAction = BaseStoriesAction<typeof StoriesActionType.STORY_DELETED, Story>;
type FetchingStoriesInitializedAction = BaseStoriesAction<typeof StoriesActionType.FETCHING_STORIES_INITIALIZED>;
type FetchingStoriesSucceededAction = BaseStoriesAction<typeof StoriesActionType.FETCHING_STORIES_SUCCEEDED, Story[]>;
type FetchingStoriesFailedAction = BaseStoriesAction<typeof StoriesActionType.FETCHING_STORIES_FAILED>;

type StoriesAction = StoryDeletedAction | FetchingStoriesInitializedAction | FetchingStoriesSucceededAction | FetchingStoriesFailedAction;

interface StoriesState {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
}

const storiesReducer: Reducer<StoriesState, StoriesAction> = (state, action) => {
  switch (action.type) {
    case StoriesActionType.STORY_DELETED: {
      const updatedStories: Story[] = state.data.filter((story: Story): boolean => story !== action.payload);
      return {
        ...state,
        data: updatedStories,
      };
    }
    case StoriesActionType.FETCHING_STORIES_INITIALIZED:
      return {
        ...state,
        data: [],
        isLoading: true,
        isError: false,
      };
    case StoriesActionType.FETCHING_STORIES_SUCCEEDED:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
      };
    case StoriesActionType.FETCHING_STORIES_FAILED:
      return {
        ...state,
        // data: [],
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error(`Unhandled action "${(action as any).type}".`);
  }
};

const App: FC = () => {
  console.log(`"${App.name}" renders.`);

  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [searchTerm, setSearchTerm] = useStorageState("searchTerm", "React");

  const handleFetchStories = useCallback(() => {
    // https://github.com/facebook/react/issues/14326#issuecomment-441680293
    let wasFetchingCancelled = false;

    const getStories = async () => {
      dispatchStories({
        type: StoriesActionType.FETCHING_STORIES_INITIALIZED,
      });

      try {
        const fetchedStories: Story[] = !searchTerm ? [] : await fetchStories(searchTerm);

        if (!wasFetchingCancelled) {
          dispatchStories({
            type: StoriesActionType.FETCHING_STORIES_SUCCEEDED,
            payload: fetchedStories,
          });
        }
      } catch {
        dispatchStories({
          type: StoriesActionType.FETCHING_STORIES_FAILED,
        });
      }
    };

    getStories();

    return () => {
      wasFetchingCancelled = true;
    };
  }, [searchTerm]);

  useEffect(handleFetchStories, [handleFetchStories]);

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

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <div className="search-form">
        <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
          <strong>Search:</strong>
        </InputWithLabel>
      </div>

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )
      }
    </div>
  );
};

export default App;
