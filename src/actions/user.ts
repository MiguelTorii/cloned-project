import { userActions } from "constants/action-types";
import { getAnnouncement as fetchAnnouncement, getAnnouncementCampaign } from "api/announcement";
import { confirmTooltip as postConfirmTooltip, getUserClasses, getSync, apiSetExpertMode } from "api/user";
import store from "store";
import isEqual from "lodash/isEqual";
import * as feedActions from "actions/feed";
import axios from "axios";
import type { Action } from "../types/action";
import type { Dispatch } from "../types/store";
import { Announcement } from "../types/models";
import { apiGetPointsHistory } from "../api/user";
import { checkUserSession } from "./sign-in";
import { apiDeleteFeed, apiFetchFeeds } from "../api/feed";
import { bookmark } from "../api/posts";
import { getPresignedURL } from "../api/media";

const setBannerHeightAction = ({
  bannerHeight
}: {
  bannerHeight: number;
}): Action => ({
  type: userActions.SET_BANNER_HEIGHT,
  payload: {
    bannerHeight
  }
});

export const setBannerHeight = ({
  bannerHeight
}: {
  bannerHeight: number;
}) => (dispatch: Dispatch) => {
  dispatch(setBannerHeightAction({
    bannerHeight
  }));
};

const clearDialogMessageAction = (): Action => ({
  type: userActions.CLEAR_DIALOG_MESSAGE
});

export const clearDialogMessage = () => (dispatch: Dispatch) => {
  dispatch(clearDialogMessageAction());
};

const setClassesAction = ({
  userClasses
}: {
  userClasses: Array<string>;
  pastClasses: Array<string>;
  emptyState: Record<string, any>;
}): Action => ({
  type: userActions.UPDATE_CLASSES,
  payload: {
    userClasses
  }
});

export const fetchClasses = skipCache => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
  try {
    const {
      user: {
        userClasses,
        data: {
          userId
        },
        expertMode
      }
    } = getState();
    const res = await getUserClasses({
      userId,
      skipCache,
      expertMode
    });
    const {
      classes: classList,
      pastClasses,
      emptyState,
      permissions: {
        canAddClasses
      }
    } = res;

    if (expertMode) {
      store.remove('CLASSES_CACHE');
      const value = classList.map(cl => JSON.stringify({
        classId: cl.classId,
        sectionId: cl.section?.[0]?.sectionId
      }));
      dispatch(feedActions.updateFilter({
        value,
        field: 'userClasses'
      }));
    }

    if (!isEqual(userClasses.classList, classList) || userClasses.canAddClasses !== canAddClasses) {
      dispatch(setClassesAction({
        userClasses: {
          classList,
          canAddClasses,
          pastClasses,
          emptyState
        }
      }));
    }
  } catch (e) {
    /* NONE */
  }
};
export const setExpertModeAction = expertMode => ({
  type: userActions.SET_EXPERT_MODE,
  payload: {
    expertMode
  }
});
export const toggleExpertMode = () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
  const {
    user: {
      data: {
        userId
      },
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

const updateTourAction = ({
  runningTour
}: {
  runningTour: boolean;
}): Action => ({
  type: userActions.UPDATE_TOUR,
  payload: {
    runningTour
  }
});

export const updateTour = runningTour => (dispatch: Dispatch) => {
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
}: {
  display: boolean;
  helpLink: string;
  largeLogo: string;
  smallLogo: string;
  resourcesBody: string;
  resourcesTitle: string;
  viewedOnboarding: boolean;
  viewedTooltips: Array<number>;
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
});

export const sync = userId => async (dispatch: Dispatch) => {
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

const updateOnboardingAction = (viewedOnboarding: boolean): Action => ({
  type: userActions.UPDATE_ONBOARDING,
  payload: {
    viewedOnboarding
  }
});

export const updateOnboarding = ({
  viewedOnboarding
}: {
  viewedOnboarding: boolean;
}) => (dispatch: Dispatch) => {
  dispatch(updateOnboardingAction(viewedOnboarding));
};

const getAnnouncementSuccessAction = (announcement: Announcement): Action => ({
  type: userActions.GET_ANNOUNCEMENT_SUCCESS,
  payload: {
    announcement
  }
});

export const updateProfileImage = imageUrl => ({
  type: userActions.UPDATE_PROFILE_IMAGE,
  payload: {
    imageUrl
  }
});
export const getAnnouncement = () => async (dispatch: Dispatch) => {
  const {
    is_disabled,
    variation_key,
    data
  } = await getAnnouncementCampaign();

  if (!is_disabled && variation_key !== 'hidden' && data) {
    const {
      end_date,
      announcement_id
    } = data;
    const announcement = await fetchAnnouncement(announcement_id);
    dispatch(getAnnouncementSuccessAction({ ...announcement,
      endDate: end_date,
      id: announcement_id
    }));
  }
};
export const getPointsHistory = (userId: number, index: number, limit: number, successCb: (...args: Array<any>) => any) => ({
  type: userActions.GET_POINTS_HISTORY,
  apiCall: () => apiGetPointsHistory(userId, {
    index,
    limit
  }),
  successCallback: successCb
});
export const setIsMasquerading = (isMasquerading: boolean) => ({
  type: userActions.SET_IS_MASQUERADING,
  payload: isMasquerading
});
export const masquerade = (userId: string, refreshToken: string, callback: (...args: Array<any>) => any) => async (dispatch: Dispatch) => {
  store.set('REFRESH_TOKEN', refreshToken);
  store.set('USER_ID', userId);
  const isAuthenticated = await dispatch(checkUserSession());

  if (isAuthenticated) {
    dispatch(setIsMasquerading(true));
  }

  if (callback) {
    callback(isAuthenticated);
  }
};
export const getFlashcards = (userId: number, bookmarked: boolean, index: number, limit: number) => ({
  type: userActions.GET_FLASHCARDS,
  apiCall: () => apiFetchFeeds({
    user_id: userId,
    bookmarked,
    tool_type_id: 3,
    index,
    limit
  })
});
export const deleteFlashcard = (userId: number, feedId: number) => ({
  type: userActions.DELETE_FLASHCARDS,
  meta: {
    feedId
  },
  apiCall: () => apiDeleteFeed(userId, feedId)
});
export const bookmarkFlashcards = (userId: number, feedId: number, isRemove: boolean, cb: (...args: Array<any>) => any) => ({
  type: userActions.BOOKMARK_FLASHCARDS,
  meta: {
    feedId
  },
  apiCall: () => bookmark({
    feedId,
    userId,
    remove: isRemove
  }),
  successCallback: cb
});
export const uploadMedia = async (userId: string, type: number, file: Blob) => {
  const {
    type: mediaType
  } = file;

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