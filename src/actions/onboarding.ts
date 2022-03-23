import { onboardingActions } from 'constants/action-types';

import { fetchOnboardingList, completeOnboardingList } from 'api/onboarding';

import type { OnboardingList } from 'types/models';
import type { Dispatch } from 'types/store';

const getAnnouncementSuccessAction = (onboardingList: OnboardingList) => ({
  type: onboardingActions.GET_ONBOARDING_LIST_SUCCESS,
  payload: {
    onboardingList
  }
});

const markAsCompletedAction = (id: number) => ({
  type: onboardingActions.MARK_AS_COMPLETED,
  payload: {
    id
  }
});

export const getOnboardingList = () => async (dispatch: Dispatch) => {
  const onboardingList = await fetchOnboardingList();
  dispatch(getAnnouncementSuccessAction(onboardingList));
};
export const markAsCompleted = (id: number) => async (dispatch: Dispatch) => {
  dispatch(markAsCompletedAction(id));
};
export const finishOnboardingList = () => async (dispatch: Dispatch) => {
  await completeOnboardingList();
  const onboardingList = await fetchOnboardingList();
  dispatch(getAnnouncementSuccessAction(onboardingList));
};
