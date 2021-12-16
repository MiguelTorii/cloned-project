import { Action } from '../../types/action';

export const hudExpertActions = {
  TOGGLE_EXPERT_MODE: 'TOGGLE_EXPERT_MODE',
  INITIAL_EXPERT_MODE: 'INITIAL_EXPERT_MODE'
};

export const hudToggleExpertMode = (): Action => ({
  type: hudExpertActions.TOGGLE_EXPERT_MODE,
  payload: {}
});

export const setInitialExpertMode = (isExpert: boolean): Action => ({
  type: hudExpertActions.INITIAL_EXPERT_MODE,
  payload: {
    isExpert
  }
});
