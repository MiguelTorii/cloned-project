import { userActions } from 'constants/action-types'
import {
  getUserClasses,
} from 'api/user'
import type { Action } from '../types/action'
import type { Dispatch } from '../types/store';

const setClassesAction = ({
  userClasses
}: {
  userClasses: Array<string>
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
    const { canAddClasses } = res.permissions
    const classNames = res.classes.map(c => c.className)
    dispatch(setClassesAction({ userClasses: {
      classNames,
      canAddClasses,
    }}))
  } catch(e) {}
}

