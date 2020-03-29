import { userActions } from 'constants/action-types'
import {
  getUserClasses,
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

