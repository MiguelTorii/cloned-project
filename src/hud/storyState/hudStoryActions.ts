import { Action } from '../../types/action';

export const hudStoryActions = {
  SET_CURRENT_STATEMENT: 'SET_CURRENT_STATEMENT'
};

export const setCurrentStatement = (currentStatement: string): Action => ({
  type: hudStoryActions.SET_CURRENT_STATEMENT,
  payload: {
    currentStatement
  }
});
