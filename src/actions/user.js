// @flow
import { userActions } from 'constants/action-types'
import { getAnnouncement as fetchAnnouncement } from 'api/announcement';
import { getCampaign } from 'api/campaign';
import {
  confirmTooltip as postConfirmTooltip,
  getUserClasses,
  getSync
} from 'api/user'
import type { Action } from '../types/action'
import type { Dispatch } from '../types/store';
import { Announcement } from '../types/models'

const setClassesAction = ({
  userClasses,
}: {
  userClasses: Array<string>,
  emptyState: Object
}): Action => ({
  type: userActions.UPDATE_CLASSES,
  payload: {
    userClasses,
  }
})

export const fetchClasses = () => async (
  dispatch: Dispatch,
  getState: Function
) => {
  try {
    const {
      user: {
        data: { userId }
      }
    } = getState()
    const res= await getUserClasses({ userId })
    const { classes: classList, emptyState, permissions: { canAddClasses } } = res

    dispatch(setClassesAction({ userClasses: {
      classList,
      canAddClasses,
      emptyState,
    }}))
  } catch(e) {}
}

const updateTourAction = ({
  runningTour
} : {
  runningTour: boolean
}): Action  => ({
  type: userActions.UPDATE_TOUR,
  payload: {
    runningTour
  }
})

export const updateTour = runningTour => (
  dispatch: Dispatch
) => {
  dispatch(updateTourAction(runningTour))
}

const syncSuccessAction = ({
  display,
  largeLogo,
  smallLogo,
  resourcesBody,
  resourcesTitle,
  viewedOnboarding,
  viewedTooltips
}: {
    display: boolean,
    largeLogo: string,
    smallLogo: string,
    resourcesBody: string,
    resourcesTitle: string,
    viewedOnboarding: boolean,
    viewedTooltips: Array<number>
}): Action => ({
  type: userActions.SYNC_SUCCESS,
  payload: {
    display,
    largeLogo,
    smallLogo,
    resourcesBody,
    resourcesTitle,
    viewedOnboarding,
    viewedTooltips
  }
})

export const sync = userId => async (
  dispatch: Dispatch
) => {
  const result = await getSync(userId)
  dispatch(syncSuccessAction(result))
}

const confirmTooltipSuccessAction = (tooltipId: number): Action => ({
  type: userActions.CONFIRM_TOOLITP_SUCCESS,
  payload: {
    tooltipId,
  }
})

export const confirmTooltip = (tooltipId: number) => async (
  dispatch: Dispatch
) => {
  await postConfirmTooltip(tooltipId)
  dispatch(confirmTooltipSuccessAction(tooltipId))
}

const updateOnboardingAction = (viewedOnboarding: boolean): Action => ({
  type: userActions.UPDATE_ONBOARDING,
  payload: {
    viewedOnboarding
  }
})

export const updateOnboarding = ({ viewedOnboarding }: { viewedOnboarding: boolean } ) => (
  dispatch: Dispatch
) => {
  dispatch(updateOnboardingAction(viewedOnboarding))
}

const getAnnouncementSuccessAction = (announcement: Announcement): Action => ({
  type: userActions.GET_ANNOUNCEMENT_SUCCESS,
  payload: { announcement }
});

export const getAnnouncement = (
  { announcementId, campaignId }: { announcementId: number, campaignId: number }) => async (
  dispatch: Dispatch
) => {
  const announcement = await fetchAnnouncement(announcementId);
  const campaign = await getCampaign({ campaignId });

  if (announcement && !campaign.is_disabled && campaign.variation_key !== 'hidden') {
    dispatch(getAnnouncementSuccessAction(announcement));
  }
};