// @flow
import { userActions } from 'constants/action-types'
import {
  confirmTooltip as postConfirmTooltip,
  getUserClasses,
  getSync
} from 'api/user'
import type { Action } from '../types/action'
import type { Dispatch } from '../types/store';

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
  viewedTooltips
}: {
    display: boolean,
    largeLogo: string,
    smallLogo: string,
    resourcesBody: string,
    resourcesTitle: string,
    viewedTooltips: Array<number>
}): Action => ({
  type: userActions.SYNC_SUCCESS,
  payload: {
    display,
    largeLogo,
    smallLogo,
    resourcesBody,
    resourcesTitle,
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
