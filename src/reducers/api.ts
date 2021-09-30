import { apiActions } from '../constants/action-types';
export default (state = {}, action) => {
  switch (action.type) {
    case apiActions.API_CALL_START: {
      return {
        ...state,
        [action.payload.api]: {
          inProgress: true,
          error: ''
        }
      };
    }

    case apiActions.API_CALL_SUCCESS: {
      return {
        ...state,
        [action.payload.api]: {
          inProgress: false,
          error: ''
        }
      };
    }

    case apiActions.API_CALL_FAILURE: {
      return {
        ...state,
        [action.payload.api]: {
          inProgress: false,
          error: action.error
        }
      };
    }

    default:
      return state;
  }
};
