import update from 'immutability-helper';
import store from 'store';
import { signInActions, signUpActions, userActions, rootActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { User, TFeedItem, UserClass, GetCampaignsResponse, Campaign } from 'types/models';
import { normalizeArray } from '../utils/helpers';

export type UserClassList = {
  classList: Array<UserClass> | null;
  pastClasses?: Array<any>;
  canAddClasses: boolean;
  emptyState: EmptyState;
};

export type EmptyState = {
  body: string;
  logo: string;
  visibility: boolean;
};

export type FlashcardData = {
  byId: Record<number, TFeedItem>;
  ids: Array<number>;
};

export type TUserClasses = {
  classList: Array<UserClass> | null | undefined;
  pastClasses?: Array<UserClass> | null | undefined;
  canAddClasses: boolean;
  emptyState: {
    body: string;
    logo: string;
    visibility: boolean;
  };
};

export type UserState = {
  action: any;
  bannerHeight: number;
  data: User;
  dialogMessage: {
    title: string;
    body: string;
  };
  error: boolean;
  errorMessage: {
    action: any;
    title: string;
    body: string;
    showSignup: boolean;
  };
  expertMode: boolean;
  flashcards: FlashcardData;
  isExpert: boolean;
  isLoading: boolean;
  isMasquerading: boolean;
  runningTour: boolean;
  syncData: {
    display: boolean;
    largeLogo: string;
    smallLogo: string;
    resourcesBody: string;
    resourcesTitle: string;
    viewedTooltips: Array<number>;
    viewedOnboarding: boolean | null;
    helpLink: string;
  };
  userClasses: TUserClasses;
  campaignsByName: Record<string, Campaign>;
};

const defaultState = {
  action: null,
  bannerHeight: 0,
  data: {
    userId: '',
    nonce: '',
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
    lmsUser: false,
    permission: []
  },
  isMasquerading: store.get('MASQUERADING') === true,
  userClasses: {
    classList: [],
    pastClasses: [],
    canAddClasses: false,
    emptyState: {
      visibility: false,
      body: '',
      logo: ''
    }
  },
  expertMode: false,
  isExpert: false,
  runningTour: false,
  isLoading: false,
  error: false,
  dialogMessage: {
    title: '',
    body: ''
  },
  errorMessage: {
    action: false,
    title: '',
    body: '',
    showSignup: false
  },
  flashcards: {
    byId: {},
    ids: []
  },
  syncData: {
    display: false,
    largeLogo: '',
    smallLogo: '',
    resourcesBody: '',
    resourcesTitle: '',
    viewedTooltips: [],
    viewedOnboarding: null,
    helpLink: ''
  },
  campaignsByName: {}
};

export default (state: UserState = defaultState, action: Action): UserState => {
  switch (action.type) {
    case userActions.SET_BANNER_HEIGHT:
      return update(state, {
        bannerHeight: {
          $set: action.payload.bannerHeight
        }
      });

    case signUpActions.SIGN_UP_USER_REQUEST:
    case signInActions.SIGN_IN_USER_REQUEST:
      return update(state, {
        data: {
          $set: defaultState.data
        },
        error: {
          $set: defaultState.error
        },
        errorMessage: {
          $set: defaultState.errorMessage
        },
        isLoading: {
          $set: true
        }
      });

    case signInActions.CHECK_USER_REQUEST:
      return update(state, {
        isLoading: {
          $set: true
        }
      });

    case signUpActions.SIGN_UP_USER_SUCCESS:
    case signInActions.SIGN_IN_USER_SUCCESS: {
      return update(state, {
        data: {
          $set: action.payload.user
        },
        isExpert: {
          $set: action.payload.isExpert
        },
        expertMode: {
          $set: action.payload.expertMode
        },
        isLoading: {
          $set: false
        }
      });
    }

    case signUpActions.SIGN_UP_USER_ERROR:
    case signInActions.SIGN_IN_USER_ERROR:
      return update(state, {
        error: {
          $set: true
        },
        errorMessage: {
          title: {
            $set: action.payload.title
          },
          body: {
            $set: action.payload.body
          },
          action: {
            $set: action.payload.action
          },
          showSignup: {
            $set: action.payload.showSignup
          }
        },
        isLoading: {
          $set: false
        }
      });

    case signUpActions.SIGN_UP_USER_CLEAR_ERROR:
    case signInActions.SIGN_IN_USER_CLEAR_ERROR:
      return update(state, {
        error: {
          $set: defaultState.error
        },
        action: {
          $set: defaultState.action
        },
        errorMessage: {
          $set: defaultState.errorMessage
        },
        isLoading: {
          $set: false
        }
      });

    case userActions.UPDATE_CLASSES:
      return update(state, {
        userClasses: {
          $set: action.payload.userClasses
        },
        isLoading: {
          $set: false
        }
      });

    case userActions.UPDATE_TOUR:
      return update(state, {
        runningTour: {
          $set: action.payload.runningTour
        }
      });

    case signInActions.SIGN_OUT_USER_REQUEST:
    case signInActions.SIGN_OUT_USER_SUCCESS:
    case rootActions.CLEAR_STATE:
      return defaultState;

    case userActions.SET_IS_MASQUERADING: {
      store.set('MASQUERADING', action.payload);
      return update(state, {
        isMasquerading: {
          $set: action.payload
        }
      });
    }

    case userActions.SYNC_SUCCESS:
      return update(state, {
        syncData: {
          display: {
            $set: action.payload.display
          },
          helpLink: {
            $set: action.payload.helpLink
          },
          largeLogo: {
            $set: action.payload.largeLogo
          },
          resourcesBody: {
            $set: action.payload.resourcesBody
          },
          resourcesTitle: {
            $set: action.payload.resourcesTitle
          },
          smallLogo: {
            $set: action.payload.smallLogo
          },
          viewedOnboarding: {
            $set: action.payload.viewedOnboarding
          },
          viewedTooltips: {
            $set: action.payload.viewedTooltips
          }
        }
      });

    case userActions.CONFIRM_TOOLITP_SUCCESS:
      return update(state, {
        syncData: {
          viewedTooltips: {
            $set: state.syncData.viewedTooltips.concat(action.payload.tooltipId)
          }
        }
      });

    case userActions.UPDATE_ONBOARDING:
      return update(state, {
        syncData: {
          viewedOnboarding: {
            $set: action.payload.viewedOnboarding
          }
        }
      });

    case userActions.SET_EXPERT_MODE: {
      return update(state, {
        isLoading: {
          $set: true
        },
        dialogMessage: {
          title: {
            $set: action.payload.expertMode
              ? 'Taking you to Expert Mode... \r\n Sit tight!'
              : 'Taking you to Student Mode... \r\n Sit tight!'
          }
        },
        expertMode: {
          $set: action.payload.expertMode
        }
      });
    }

    case userActions.CLEAR_DIALOG_MESSAGE:
      return update(state, {
        isLoading: {
          $set: false
        },
        dialogMessage: {
          title: {
            $set: ''
          },
          body: {
            $set: ''
          }
        }
      });

    case userActions.GET_FLASHCARDS: {
      return update(state, {
        flashcards: {
          $set: normalizeArray(action.payload, 'feedId')
        }
      });
    }

    case userActions.BOOKMARK_FLASHCARDS: {
      if (!state.flashcards.ids.includes(action.meta.feedId)) {
        return state;
      }

      return update(state, {
        flashcards: {
          byId: {
            [action.meta.feedId]: (data) => ({ ...data, bookmarked: !data.bookmarked })
          }
        }
      });
    }

    case userActions.DELETE_FLASHCARDS: {
      return update(state, {
        flashcards: {
          ids: (data) => data.filter((id) => id !== action.meta.feedId)
        }
      });
    }

    case userActions.UPDATE_PROFILE_IMAGE: {
      return update(state, {
        data: {
          profileImage: {
            $set: action.payload.imageUrl
          }
        }
      });
    }

    case userActions.LOAD_CAMPAIGNS: {
      const { campaigns } = action.payload as GetCampaignsResponse;
      const campaignsByName = {};

      campaigns.forEach((campaign) => {
        campaignsByName[campaign.campaign_name] = campaign;
      });

      return update(state, {
        campaignsByName: { $set: campaignsByName }
      });
    }

    default:
      return state;
  }
};
