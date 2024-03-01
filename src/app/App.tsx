import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { InputWithLabel, List } from "../components";
import { useStorageState } from "../hooks";
import { Story } from "../models";
import { StyledContainer, StyledHeadlinePrimary, StyledSearchForm } from "./App.styled";
import { fetchStories } from "./fetchStories";
import { StoriesActionType, storiesReducer } from "./storiesReducer";

const sumStoriesComments = (stories: Story[]): number =>
  stories.reduce((accumulator: number, currentValue: Story): number => accumulator + currentValue.num_comments, 0);

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

  const handleRemoveStory = useCallback((story: Story): void => {
    dispatchStories({
      type: StoriesActionType.STORY_DELETED,
      payload: story,
    });
  }, [dispatchStories]);

  const totalComments: number = useMemo(() => sumStoriesComments(stories.data), [stories.data]);

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories ({totalComments} total comments)</StyledHeadlinePrimary>

      <StyledSearchForm>
        <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
          <strong>Search:</strong>
        </InputWithLabel>
      </StyledSearchForm>

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )
      }
    </StyledContainer>
  );
};

export default App;
