import { describe, it, expect } from 'vitest';

import { Story } from '../models';
import { StoriesAction, StoriesActionType, StoriesState, storiesReducer } from "./storiesReducer";

const STORY_ONE: Story = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const STORY_TWO: Story = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const INITIAL_STATE: StoriesState = {
  data: [STORY_ONE],
  isLoading: false,
  isError: false,
};

describe(storiesReducer.name, () => {
  describe(`WHEN received action is "${StoriesActionType.STORY_DELETED}"`, () => {
    it('SHOULD remove the provided story', () => {
      const action: StoriesAction = {
        type: StoriesActionType.STORY_DELETED,
        payload: STORY_ONE,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        data: [],
      }));
    });

    it('SHOULD not remove the provided story IF it is not in the state', () => {
      const action: StoriesAction = {
        type: StoriesActionType.STORY_DELETED,
        payload: STORY_TWO,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        data: [STORY_ONE],
      }));
    });
  });

  describe(`WHEN received action is "${StoriesActionType.FETCHING_STORIES_INITIALIZED}"`, () => {
    it('SHOULD remove all stories from the state', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_INITIALIZED,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        data: [],
      }));
    });

    it('SHOULD set "isLoading" to "true"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_INITIALIZED,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isLoading: true,
      }));
    });

    it('SHOULD set "isError" to "false"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_INITIALIZED,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isError: false,
      }));
    });
  });

  describe(`WHEN received action is "${StoriesActionType.FETCHING_STORIES_SUCCEEDED}"`, () => {
    it('SHOULD set stories to the provided ones', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_SUCCEEDED,
        payload: [STORY_TWO],
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        data: [STORY_TWO],
      }));
    });

    it('SHOULD set "isLoading" to "false"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_SUCCEEDED,
        payload: [],
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isLoading: false,
      }));
    });

    it('SHOULD set "isError" to "false"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_SUCCEEDED,
        payload: [],
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isError: false,
      }));
    });
  });

  describe(`WHEN received action is "${StoriesActionType.FETCHING_STORIES_FAILED}"`, () => {
    // it('SHOULD remove all stories from the state', () => {
    //     const action: StoriesAction = {
    //         type: StoriesActionType.FETCHING_STORIES_FAILED,
    //     };
    //     const state: StoriesState = INITIAL_STATE;

    //     const newState: StoriesState = storiesReducer(state, action);

    //     expect(newState).toStrictEqual(expect.objectContaining({
    //         data: [],
    //     }));
    // });

    it('SHOULD set "isLoading" to "false"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_FAILED,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isLoading: false,
      }));
    });

    it('SHOULD set "isError" to "true"', () => {
      const action: StoriesAction = {
        type: StoriesActionType.FETCHING_STORIES_FAILED,
      };
      const state: StoriesState = INITIAL_STATE;

      const newState: StoriesState = storiesReducer(state, action);

      expect(newState).toStrictEqual(expect.objectContaining({
        isError: true,
      }));
    });
  });

  it('WHEN received action is invalid SHOULD throw an error', () => {
    const invalidActionType = "invalid_action" as unknown as StoriesActionType;
    const action = {
      type: invalidActionType,
    } as StoriesAction;
    const state: StoriesState = INITIAL_STATE;

    expect(() => storiesReducer(state, action)).toThrowError(`Unhandled action "${invalidActionType}".`);
  });
});
