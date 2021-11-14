import { Action } from '../../types/action';

export const hudStoryActions = {
  SET_CONVERSATION: 'SET_CONVERSATION'
};

export const setConversation = (conversation: string): Action => ({
  type: hudStoryActions.SET_CONVERSATION,
  payload: {
    conversation
  }
});
