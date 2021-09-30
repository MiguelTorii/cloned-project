import { get } from 'lodash';
import { apiActions } from '../constants/action-types';

const apiActionCreator = ({
  dispatch
}) => next => async action => {
  const {
    type,
    apiCall,
    meta,
    successCallback = () => { },
    failureCallback = () => { }
  } = action;

  if (typeof apiCall !== 'function') {
    return next(action);
  }

  try {
    dispatch({
      type: apiActions.API_CALL_START,
      payload: {
        api: type
      }
    });
    const response = await apiCall();
    dispatch({
      type,
      payload: response,
      meta
    });
    dispatch({
      type: apiActions.API_CALL_SUCCESS,
      payload: {
        api: type,
        response
      }
    }).then(() => successCallback(response));
  } catch (error) {
    const errorData = get(error, 'response.data');
    dispatch({
      type: apiActions.API_CALL_FAILURE,
      payload: {
        api: type
      },
      errorData
    }).then(() => failureCallback(errorData));
  }
};

export default apiActionCreator;
