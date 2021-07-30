// @flow
import update from 'immutability-helper';
import { onboardingActions } from 'constants/action-types';
import type { OnboardingList } from 'types/models';

export type OnboardingState = {
  onboardingList: OnboardingList
};

const defaultState = {
  onboardingList: {
    checklist: [],
    visible: false
  }
};

export default (
  state: OnboardingState = defaultState,
  action: any
): OnboardingState => {
  switch (action.type) {
    case onboardingActions.GET_ONBOARDING_LIST_SUCCESS:
      return update(state, {
        onboardingList: { $set: action.payload.onboardingList }
      });
    case onboardingActions.MARK_AS_COMPLETED:
      return {
        ...state,
        onboardingList: {
          ...state.onboardingList,
          checklist: state.onboardingList.checklist.map((item) => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                completed: true
              };
            }
            return item;
          })
        }
      };
    default:
      return state;
  }
};
