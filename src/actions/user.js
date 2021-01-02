// @flow
import { userActions } from 'constants/action-types'
import { getAnnouncement as fetchAnnouncement } from 'api/announcement';
import { getCampaign } from 'api/campaign';
import {
  confirmTooltip as postConfirmTooltip,
  getUserClasses,
  getSync
} from 'api/user'
import { push } from 'connected-react-router';
import store from 'store'
import isEqual from 'lodash/isEqual'
import * as feedActions from 'actions/feed';
import type { Action } from '../types/action'
import type { Dispatch } from '../types/store';
import { Announcement } from '../types/models'

const clearDialogMessageAction = (): Action => ({
  type: userActions.CLEAR_DIALOG_MESSAGE
})

export const clearDialogMessage = () => (dispatch: Dispatch) => {
  dispatch(clearDialogMessageAction())
}

const toggleExpertModeAction = (): Action => ({
  type: userActions.TOGGLE_EXPERT_MODE
})

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

export const fetchClasses = (skipCache) => async (
  dispatch: Dispatch,
  getState: Function
) => {
  try {
    const {
      user: {
        userClasses,
        data: { userId },
        expertMode
      }
    } = getState()

    const res = await getUserClasses({ userId, skipCache, expertMode })
    const { classes: classList, emptyState, permissions: { canAddClasses } } = res

    if (expertMode) {
      store.remove('CLASSES_CACHE')

      const value = classList.map(cl => (
        JSON.stringify({
          classId: cl.classId,
          sectionId: cl.section[0].sectionId
        })
      ))

      dispatch(feedActions.updateFilter({
        value,
        field: 'userClasses',
      }))
    }

    if (
      !isEqual(userClasses.classList, classList) ||
      userClasses.canAddClasses !== canAddClasses
    ) {
      dispatch(setClassesAction({
        userClasses: {
          classList,
          canAddClasses,
          emptyState,
        }
      }
      ))
    }
  } catch (e) {/* NONE */}
}

export const toggleExpertMode = () => (
  dispatch: Dispatch,
  getState: Function
) => {
  const {
    router: {
      location: {
        pathname
      }
    }
  } = getState()

  dispatch(toggleExpertModeAction())
  dispatch(fetchClasses(true))

  if ([
    '/feed',
    '/my_posts',
    '/leaderboard',
    '/bookmarks'
  ].includes(pathname)) dispatch(push('/'))
}

const updateTourAction = ({
  runningTour
}: {
  runningTour: boolean
}): Action => ({
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
  helpLink,
  largeLogo,
  smallLogo,
  resourcesBody,
  resourcesTitle,
  viewedOnboarding,
  viewedTooltips
}: {
  display: boolean,
  helpLink: string,
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
    helpLink,
    viewedOnboarding,
    viewedTooltips
  }
})

export const sync = userId => async (
  dispatch: Dispatch
) => {
  const result = await getSync(userId)
  if (result)
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

export const updateOnboarding = ({ viewedOnboarding }: {viewedOnboarding: boolean}) => (
  dispatch: Dispatch
) => {
  dispatch(updateOnboardingAction(viewedOnboarding))
}

const getAnnouncementSuccessAction = (announcement: Announcement): Action => ({
  type: userActions.GET_ANNOUNCEMENT_SUCCESS,
  payload: { announcement }
});

export const getAnnouncement = (
  { announcementId, campaignId }: {announcementId: number, campaignId: number}) => async (
  dispatch: Dispatch
) => {
  const announcement = await fetchAnnouncement(announcementId);
  const campaign = await getCampaign({ campaignId });

  // eslint-disable-next-line
    if (announcement && !campaign?.is_disabled && campaign?.variation_key !== 'hidden') {
    dispatch(getAnnouncementSuccessAction(announcement));
  }
};
