import { TMission } from '../../types/models';

export const rightPanelActions = {
  SET_MISSIONS: 'SET_MISSIONS'
};

export const setMissions = (missions: Array<TMission>) => ({
  type: rightPanelActions.SET_MISSIONS,
  payload: { missions }
});
