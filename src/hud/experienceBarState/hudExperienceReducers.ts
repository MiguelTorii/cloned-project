import { experienceActions } from './hudExperienceActions';
import { defaultState } from './hudExperienceState';

import type { ExperienceState } from './hudExperienceState';
import type { Action } from 'types/action';

export default (state: ExperienceState = defaultState, action: Action): ExperienceState => {
  switch (action.type) {
    case experienceActions.SET_EXPERIENCE_POINTS:
      return {
        ...state,
        experiencePoints: action.payload.experiencePoints
      };
    case experienceActions.SET_EXPERIENCE_GOAL_TOTAL:
      return {
        ...state,
        experienceTotal: action.payload.experienceTotal
      };
    case experienceActions.ADD_EXPERIENCE_POINTS:
      return {
        ...state,
        experiencePoints: (state.experiencePoints || 0) + action.payload.experiencePoints
      };
    default:
      return state;
  }
};
