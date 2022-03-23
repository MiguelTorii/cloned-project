import axios from 'axios';
import isEqual from 'lodash/isEqual';
import store from 'store';

import { userActions } from 'constants/action-types';

import { apiDeleteFeed, apiFetchFeeds } from 'api/feed';
import { getPresignedURL } from 'api/media';
import { bookmark } from 'api/posts';
import {
  confirmTooltip as postConfirmTooltip,
  getUserClasses,
  getSync,
  apiSetExpertMode,
  apiGetPointsHistory,
  apiGetCampaigns
} from 'api/user';

import { checkUserSession } from './sign-in';

import type { APIFetchFeedsParams } from 'api/params/APIFetchFeedsParams';
import type { UserClassList, EmptyState } from 'reducers/user';
import type { Action } from 'types/action';
import type { SyncSuccessData, TFeedItem } from 'types/models';
import type { Dispatch } from 'types/store';

const setBannerHeightAction = ({ bannerHeight }: { bannerHeight: number }): Action => ({
  type: userActions.SET_BANNER_HEIGHT,
  payload: {
    bannerHeight
  }
});

export const setBannerHeight =
  ({ bannerHeight }: { bannerHeight: number }) =>
  (dispatch: Dispatch) => {
    dispatch(
      setBannerHeightAction({
        bannerHeight
      })
    );
  };

const clearDialogMessageAction = (): Action => ({
  type: userActions.CLEAR_DIALOG_MESSAGE
});

export const clearDialogMessage = () => (dispatch: Dispatch) => {
  dispatch(clearDialogMessageAction());
};

const setClassesAction = ({
  userClasses,
  pastClasses
}: {
  userClasses: UserClassList;
  pastClasses?: Array<string>;
  emptyState?: Record<string, any>;
}): Action => ({
  type: userActions.UPDATE_CLASSES,
  payload: {
    userClasses
  }
});

export const fetchClasses =
  (skipCache?: boolean) => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      user: {
        userClasses,
        data: { userId },
        expertMode
      }
    } = getState();
    const res: any = await getUserClasses({
      userId,
      skipCache,
      expertMode
    });
    const {
      classes: classList,
      pastClasses,
      emptyState,
      permissions: { canAddClasses }
    } = res;

    if (expertMode) {
      store.remove('CLASSES_CACHE');
    }

    if (!isEqual(userClasses.classList, classList) || userClasses.canAddClasses !== canAddClasses) {
      dispatch(
        setClassesAction({
          userClasses: {
            classList,
            canAddClasses,
            pastClasses,
            emptyState: emptyState as EmptyState
          }
        })
      );
    }
  };
export const setExpertModeAction = (expertMode) => ({
  type: userActions.SET_EXPERT_MODE,
  payload: {
    expertMode
  }
});
export const toggleExpertMode =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      user: {
        data: { userId },
        expertMode
      }
    } = getState();
    const newExpertMode = !expertMode;
    dispatch(setExpertModeAction(newExpertMode));
    const apiSuccess = await apiSetExpertMode(userId, newExpertMode);

    if (apiSuccess) {
      dispatch(fetchClasses(true));
    } else {
      dispatch(setExpertModeAction(expertMode));
    }

    setTimeout(() => dispatch(clearDialogMessageAction()), 2000);
  };

const updateTourAction = ({ runningTour }: { runningTour: boolean }): Action => ({
  type: userActions.UPDATE_TOUR,
  payload: {
    runningTour
  }
});

export const updateTour = (runningTour) => (dispatch: Dispatch) => {
  dispatch(updateTourAction(runningTour));
};

const syncSuccessAction = ({
  display,
  helpLink,
  largeLogo,
  smallLogo,
  resourcesBody,
  resourcesTitle,
  viewedOnboarding,
  viewedTooltips
}: SyncSuccessData): Action => ({
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
});

export const sync = (userId) => async (dispatch: Dispatch) => {
  const result = await getSync(userId);

  if (result) {
    dispatch(syncSuccessAction(result));
  }
};

const confirmTooltipSuccessAction = (tooltipId: number): Action => ({
  type: userActions.CONFIRM_TOOLITP_SUCCESS,
  payload: {
    tooltipId
  }
});

export const confirmTooltip = (tooltipId: number) => async (dispatch: Dispatch) => {
  await postConfirmTooltip(tooltipId);
  dispatch(confirmTooltipSuccessAction(tooltipId));
};

export const updateOnboardingAction = (viewedOnboarding: boolean): Action => ({
  type: userActions.UPDATE_ONBOARDING,
  payload: {
    viewedOnboarding
  }
});

export const updateOnboarding =
  ({ viewedOnboarding }: { viewedOnboarding: boolean }) =>
  (dispatch: Dispatch) => {
    dispatch(updateOnboardingAction(viewedOnboarding));
  };

export const updateProfileImage = (imageUrl) => ({
  type: userActions.UPDATE_PROFILE_IMAGE,
  payload: {
    imageUrl
  }
});
export const getPointsHistory = (
  userId: string,
  index: number,
  limit: number,
  successCb: (...args: Array<any>) => any
) => ({
  type: userActions.GET_POINTS_HISTORY,
  apiCall: () =>
    apiGetPointsHistory(userId, {
      index,
      limit
    }),
  successCallback: successCb
});
export const setIsMasquerading = (isMasquerading: boolean) => ({
  type: userActions.SET_IS_MASQUERADING,
  payload: isMasquerading
});
export const masquerade =
  (userId: string, refreshToken: string, callback: (...args: Array<any>) => any) =>
  async (dispatch: Dispatch) => {
    store.set('REFRESH_TOKEN', refreshToken);
    store.set('USER_ID', userId);
    // TODO reconcile the types here.
    // Dispatch expects an action type (which is not a promise --
    // for promise based work, it expects a Thunk, not a raw promise)
    // but checkUserSession returns a promise.
    // I'm not sure how this actually works at all, so set it to any type for now.
    const isAuthenticated = await dispatch(checkUserSession() as any);

    if (isAuthenticated) {
      dispatch(setIsMasquerading(true));
    }

    if (callback) {
      callback(isAuthenticated);
    }
  };
export const getFlashcards = (
  userId: string | undefined,
  bookmarked?: boolean,
  index?: number,
  limit?: number
) => ({
  type: userActions.GET_FLASHCARDS,
  apiCall: (): Promise<TFeedItem[]> => {
    const params: APIFetchFeedsParams = {
      bookmarked,
      tool_type_id: 3,
      index,
      limit
    };

    // Add optional values.
    if (userId) {
      params.user_id = Number(userId);
    }

    return apiFetchFeeds(params);
  }
});
export const deleteFlashcard = (userId: string, feedId: number) => ({
  type: userActions.DELETE_FLASHCARDS,
  meta: {
    feedId
  },
  apiCall: () => apiDeleteFeed(userId, feedId)
});
export const bookmarkFlashcards = (
  userId: string,
  feedId: number,
  isRemove: boolean,
  cb?: (...args: Array<any>) => any
) => ({
  type: userActions.BOOKMARK_FLASHCARDS,
  meta: {
    feedId
  },
  apiCall: () =>
    bookmark({
      feedId,
      userId,
      remove: isRemove
    }),
  successCallback: cb
});
export const uploadMedia = async (userId: string, type: number, file: Blob) => {
  const { type: mediaType } = file;

  try {
    const mediaData = await getPresignedURL({
      userId,
      type,
      mediaType
    });
    await axios.put(mediaData.url, file, {
      headers: {
        'Content-Type': type
      }
    });
    return mediaData;
  } catch (err) {
    return null;
  }
};

export const loadCampaigns = (userId: number) => ({
  type: userActions.LOAD_CAMPAIGNS,
  apiCall: () => apiGetCampaigns(userId)
});
