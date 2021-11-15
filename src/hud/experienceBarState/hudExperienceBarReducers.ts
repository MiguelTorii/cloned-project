import { Action } from '../../types/action';
import { experienceBarActions } from './hudExperienceBarActions';
import { defaultState, ExperienceBarState } from './hudExperienceBarState';

export default (state: ExperienceBarState = defaultState, action: Action): ExperienceBarState => {
  switch (action.type) {
    case experienceBarActions.SET_EXPERIENCE_POINTS:
      return {
        ...state,
        experienceBarPoints: action.payload.experienceBarPoints,
        experienceBarTotal: state.experienceBarTotal
      };
    case experienceBarActions.SET_EXPERIENCE_GOAL_TOTAL:
      return {
        ...state,
        // clears out previous point amount when setting a new goal
        experienceBarPoints: 0,
        experienceBarTotal: action.payload.experienceBarTotal
      };
    default:
      return state;
  }
};
