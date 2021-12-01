import { Action } from '../../types/action';

export const hudStoryActions = {
  SET_CURRENT_STATEMENT: 'SET_CURRENT_STATEMENT',
  GREETING_LOAD_TRIGGERED: 'GREETING_LOAD_TRIGGERED',
  SET_GREETING: 'SET_GREETING'
};

export const setCurrentStatement = (currentStatement: string): Action => ({
  type: hudStoryActions.SET_CURRENT_STATEMENT,
  payload: {
    currentStatement
  }
});

export const setGreetingLoadTriggered = (): Action => ({
  type: hudStoryActions.GREETING_LOAD_TRIGGERED,
  payload: {}
});

export const setGreeting = (greetingStatements: string[]): Action => ({
  type: hudStoryActions.SET_GREETING,
  payload: {
    greetingStatements
  }
});
