import { storyActions } from '../constants/action-types';
import type { Action } from '../types/action';

export type StoryState = {
  data: {
    conversation: string;
  };
};

const defaultState = {
  data: {
    conversation: ''
  }
};

export default (state: StoryState = defaultState, action: Action): StoryState => {
  switch (action.type) {
    case storyActions.SET_CONVERSATION:
      return {
        ...state,
        data: {
          conversation: action.payload.conversation
        }
      };
    default:
      return state;
  }
};
