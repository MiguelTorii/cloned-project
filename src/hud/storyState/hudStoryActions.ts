import { Action } from '../../types/action';

export const hudStoryActions = {
  SET_CONVERSATION: 'SET_CONVERSATION',
  INITIAL_STORY_LOAD: 'INITIAL_STORY_LOAD'
};

export const setConversation = (conversation: string): Action => ({
  type: hudStoryActions.SET_CONVERSATION,
  payload: {
    conversation
  }
});

export const setInitialLoad = (initialLoadTriggered: boolean): Action => ({
  type: hudStoryActions.INITIAL_STORY_LOAD,
  payload: {
    initialLoadTriggered: true
  }
});
