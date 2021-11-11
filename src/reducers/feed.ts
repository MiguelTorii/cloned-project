import update from 'immutability-helper';
import { rootActions, feedActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { TFeedItem } from '../types/models';
import { POST_WRITER } from '../constants/common';
import { FEEDS_PER_PAGE } from '../constants/app';
import { feedToCamelCaseV2 } from '../api/utils';

export type FeedState = {
  data: {
    items: TFeedItem[];
    hasMore: boolean;
    lastIndex: number;
    filters: {
      userClasses: Array<string>;
      index?: number;
      limit?: number;
      postTypes: Array<string>;
      from: string;
      bookmark: boolean;
      query: string;
      fromDate: Record<string, any> | null | undefined;
      toDate: Record<string, any> | null | undefined;
      pastFilter: boolean;
    };
  };
  error: boolean;
  errorMessage: {
    title: string;
    body: string;
  };
  isLoading: boolean;
  scrollData: {
    position: number;
    classId: number;
  };
  lastClickedPostScrollPosition: number;
};

const defaultState = {
  data: {
    items: [],
    hasMore: true,
    lastIndex: 0,
    filters: {
      userClasses: [],
      // an array of sectionIds
      postTypes: [],
      from: POST_WRITER.CLASSMATES,
      bookmark: false,
      query: '',
      fromDate: null,
      toDate: null,
      pastFilter: false
    }
  },
  error: false,
  errorMessage: {
    title: '',
    body: ''
  },
  isLoading: false,
  lastClickedPostScrollPosition: null,
  scrollData: {
    position: null,
    classId: -1
  }
};

export default (state: FeedState = defaultState, action: Action): FeedState => {
  switch (action.type) {
    case feedActions.SEARCH_FEED_REQUEST:
    case feedActions.FETCH_FEED_REQUEST:
      return update(state, {
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

    case feedActions.FETCH_FEED_SUCCESS:
      return update(state, {
        data: {
          items: {
            $push: action.payload.feed
          },
          hasMore: {
            $set: action.payload.hasMore
          }
        },
        errorMessage: {
          $set: defaultState.errorMessage
        },
        isLoading: {
          $set: false
        }
      });

    case feedActions.SEARCH_FEED_SUCCESS:
      return update(state, {
        data: {
          items: {
            $set: action.payload.feed
          }
        },
        errorMessage: {
          $set: defaultState.errorMessage
        },
        isLoading: {
          $set: false
        }
      });

    case feedActions.FETCH_FEED_ERROR:
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
          }
        },
        isLoading: {
          $set: false
        }
      });

    case feedActions.CLEAR_FEED_ERROR:
      return update(state, {
        error: {
          $set: defaultState.error
        },
        errorMessage: {
          $set: defaultState.errorMessage
        },
        isLoading: {
          $set: false
        }
      });

    case feedActions.UPDATE_BOOKMARK_REQUEST:
      return update(state, {
        data: {
          items: {
            $apply: (b) => {
              const index = b.findIndex((item) => item.feedId === action.payload.feedId);

              if (index > -1) {
                return update(b, {
                  [index]: {
                    bookmarked: {
                      $set: !action.payload.bookmarked
                    }
                  }
                });
              }

              return b;
            }
          }
        }
      });

    case feedActions.UPDATE_FEED_FILTER_FIELD_REQUEST:
      return update(state, {
        data: {
          filters: {
            [action.payload.field]: {
              $set: action.payload.value
            }
          }
        }
      });

    case feedActions.CLEAR_FEEDS:
      return update(state, {
        data: {
          items: {
            $set: []
          },
          hasMore: {
            $set: true
          },
          lastIndex: {
            $set: 0
          }
        }
      });

    case feedActions.UPDATE_FEED_LIMIT_REQUEST:
      return update(state, {
        data: {
          filters: {
            limit: {
              $set: action.payload.limit
            }
          }
        }
      });

    case feedActions.CLEAR_FEED_FILTER_REQUEST:
      return update(state, {
        data: {
          filters: {
            $set: defaultState.data.filters
          }
        }
      });

    case feedActions.UPDATE_SCROLL_DATA:
      return update(state, {
        scrollData: {
          $set: action.payload
        }
      });

    case feedActions.RESET_SCROLL_DATA:
      return update(state, {
        scrollData: {
          $set: defaultState.scrollData
        }
      });

    case feedActions.UPDATE_FILTER_FIELDS: {
      return update(state, {
        data: {
          filters: (filterData) => ({
            ...filterData,
            ...action.payload
          })
        }
      });
    }

    case feedActions.FETCH_FEED: {
      const posts = action.payload || [];
      return update(state, {
        data: {
          items: {
            $push: posts
          },
          hasMore: {
            $set: posts.length >= FEEDS_PER_PAGE
          },
          lastIndex: (data) => data + posts.length
        }
      });
    }

    case feedActions.DELETE_FEED: {
      return update(state, {
        data: {
          items: (data) => data.filter((feed) => feed.feedId !== action.payload.feedId)
        }
      });
    }

    case feedActions.BOOKMARK_FEED: {
      const { feedId, bookmarked } = action.meta;
      const { bookmark: filterBookmark } = state.data.filters;

      // If only bookmarked posts show up and the bookmark was removed from the post, it should be removed from the list.
      if (filterBookmark && !bookmarked) {
        return update(state, {
          data: {
            items: (data) => data.filter((feed) => feed.feedId !== feedId)
          }
        });
      }

      return update(state, {
        data: {
          items: (data) =>
            data.map((feed) => {
              if (feed.feedId !== feedId) {
                return feed;
              }

              return {
                ...feed,
                bookmarked: bookmarked
              };
            })
        }
      });
    }

    case rootActions.CLEAR_STATE:
      return defaultState;

    default:
      return state;
  }
};
