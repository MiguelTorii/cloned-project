import { Action } from '../../types/action';
import { experienceActions } from './hudExperienceActions';
import { defaultState, ExperienceState } from './hudExperienceState';

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
    default:
      return state;
  }
};
