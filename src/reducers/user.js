/**
 * @format
 * @flow
 */
import update from 'immutability-helper';
import {
  signInActions,
  signUpActions,
  userActions,
  rootActions
} from '../constants/action-types';
import type { Action } from '../types/action';
import type { User } from '../types/models';

export type UserState = {
  isLoading: boolean,
  data: User,
  error: boolean,
  runningTour: boolean,
  userClasses: {
    classList: ?Array<Object>,
    canAddClasses: boolean,
    emptyState: {
      visibility: boolean,
      logo: string,
      body: string
    }
  },
  syncData: {
    display: boolean,
    largeLogo: string,
    smallLogo: string,
    resourcesBody: string,
    resourcesTitle: string,
    viewedTooltips: Array<number>,
    viewedOnboarding: boolean
  },
  errorMessage: {
    title: string,
    body: string,
    showSignup: boolean
  }
};

const defaultState = {
  data: {
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    school: '',
    schoolId: 0,
    segment: '',
    twilioToken: '',
    canvasUser: false,
    grade: 0,
    jwtToken: '',
    refreshToken: '',
    profileImage: '',
    rank: 0,
    referralCode: '',
    updateProfile: [],
    lmsTypeId: -1,
    lmsUser: false
  },
  userClasses: {
    classList: [],
    canAddClasses: false,
    emptyState: {
      visibility: false,
      body: '',
      logo: '',
    }
  },
  syncData: {
    display: false,
    largeLogo: '',
    smallLogo: '',
    resourcesBody: '',
    resourcesTitle: '',
    viewedTooltips: null,
    viewedOnboarding: null,
  },
  runningTour: false,
  isLoading: false,
  error: false,
  errorMessage: {
    title: '',
    body: '',
    showSignup: false
  }
};

export default (state: UserState = defaultState, action: Action): UserState => {
  switch (action.type) {
  case signUpActions.SIGN_UP_USER_REQUEST:
  case signInActions.SIGN_IN_USER_REQUEST:
    return update(state, {
      data: { $set: defaultState.data },
      error: { $set: defaultState.error },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: true }
    });
  case signInActions.CHECK_USER_REQUEST:
    return update(state, {
      isLoading: { $set: true }
    });
  case signUpActions.SIGN_UP_USER_SUCCESS:
  case signInActions.SIGN_IN_USER_SUCCESS:
    return update(state, {
      // $FlowFixMe
      data: { $set: action.payload.user },
      isLoading: { $set: false }
    });
  case signUpActions.SIGN_UP_USER_ERROR:
  case signInActions.SIGN_IN_USER_ERROR:
    return update(state, {
      error: { $set: true },
      errorMessage: {
        // $FlowFixMe
        title: { $set: action.payload.title },
        // $FlowFixMe
        body: { $set: action.payload.body },
        // $FlowFixMe
        showSignup: { $set: action.payload.showSignup }
      },
      isLoading: { $set: false }
    });
  case signUpActions.SIGN_UP_USER_CLEAR_ERROR:
  case signInActions.SIGN_IN_USER_CLEAR_ERROR:
    return update(state, {
      error: { $set: defaultState.error },
      errorMessage: { $set: defaultState.errorMessage },
      isLoading: { $set: false }
    });
  case userActions.UPDATE_CLASSES:
    return update(state, {
      // $FlowFixMe
      userClasses: { $set: action.payload.userClasses }
    })
  case userActions.UPDATE_TOUR:
    return update(state, {
      // $FlowFixMe
      runningTour: { $set: action.payload.runningTour }
    })
  case signInActions.SIGN_OUT_USER_REQUEST:
  case signInActions.SIGN_OUT_USER_SUCCESS:
  case rootActions.CLEAR_STATE:
    return defaultState;
  case userActions.SYNC_SUCCESS:
    return update(state, {
      syncData: {
        display: { $set: action.payload.display },
        largeLogo: { $set: action.payload.largeLogo },
        resourcesBody: { $set: action.payload.resourcesBody },
        resourcesTitle: { $set: action.payload.resourcesTitle },
        smallLogo: { $set: action.payload.smallLogo },
        viewedOnboarding: { $set: action.payload.viewedOnboarding },
        viewedTooltips: { $set: action.payload.viewedTooltips }
      },
    });
  case userActions.CONFIRM_TOOLITP_SUCCESS:
    return update(state, {
      syncData: {
        viewedTooltips: {
          $set: state.syncData.viewedTooltips.concat(action.payload.tooltipId)
        },
      },
    });
  case userActions.UPDATE_ONBOARDING:
    return update(state, {
      syncData: {
        viewedOnboarding: {
          $set: action.payload.viewedOnboarding
        },
      },
    });
  default:
    return state;
  }
};
