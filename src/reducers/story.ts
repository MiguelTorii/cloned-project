import { storyActions } from '../constants/action-types';
import type { Action } from '../types/action';
import conversations from '../assets/hud-avatar/conversations';
// create a data folder with the avatar and the conversations

export type StoryState = {
  data: {
    conversationSequence: string[];
  };
};

const defaultState = {
  data: {
    conversationSequence: ['']
  }
};

export default (state: StoryState = defaultState, action: Action): StoryState => {
  switch (action.type) {
    case storyActions.SET_CONVERSATION:
      return {
        ...state,
        data: {
          conversationSequence: action.payload.conversationSequence
        }
      };
    default:
      return state;
  }
};
