import { notificationsActions, rootActions } from "../constants/action-types";
import type { Action } from "../types/action";
export type NotificationsState = {
  items: Array<Record<string, any>>;
};
const defaultState = {
  items: []
};
export default ((state: NotificationsState = defaultState, action: Action): NotificationsState => {
  switch (action.type) {
    case notificationsActions.ENQUEUE_SNACKBAR_REQUEST:
      return { ...state,
        items: [...state.items, action.payload.notification]
      };

    case notificationsActions.CLOSE_SNACKBAR_REQUEST:
      return { ...state,
        items: state.items.map(notification => action.payload.dismissAll || notification.key === action.payload.key ? { ...notification,
          dismissed: true
        } : { ...notification
        })
      };

    case notificationsActions.REMOVE_SNACKBAR_REQUEST:
      return { ...state,
        items: state.items.filter(notification => notification.key !== action.payload.key)
      };

    case rootActions.CLEAR_STATE:
      return defaultState;

    default:
      return state;
  }
});