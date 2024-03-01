import { Reducer } from "react";

import { Story } from "../models";

//https://redux.js.org/style-guide/#model-actions-as-events-not-setters
export enum StoriesActionType {
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

export type StoriesAction = StoryDeletedAction | FetchingStoriesInitializedAction | FetchingStoriesSucceededAction | FetchingStoriesFailedAction;

export interface StoriesState {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
}

export const storiesReducer: Reducer<StoriesState, StoriesAction> = (state, action) => {
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
