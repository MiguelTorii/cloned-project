import { storyActions } from '../constants/action-types';

export const setConversation = (conversation: string) => ({
  type: storyActions.SET_CONVERSATION,
  payload: {
    conversation
  }
});
