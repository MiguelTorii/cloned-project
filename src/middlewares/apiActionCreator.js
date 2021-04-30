import { apiActions } from '../constants/action-types';
import { get } from 'lodash';

const apiActionCreator = ({dispatch}) => next => async action => {
  const {
    isApiCall,
    type,
    apiCall,
    meta,
    successCallback = () => {},
    failureCallback = () => {}
  } = action;

  if (!isApiCall) {
    return next(action);
  }

  if (typeof apiCall !== 'function') {
    throw new Error('Expected `apiCall` to be a function');
  }

  try {
    dispatch({
      type: apiActions.API_CALL_START,
      payload: { api: type }
    });
    const response = await apiCall();
    dispatch({
      type,
      payload: response,
      meta
    });
    dispatch({
      type: apiActions.API_CALL_SUCCESS,
      payload: { api: type, response }
    }).then(() => successCallback(response));
  } catch(error) {
    const errorData = get(error, 'response.data');
    dispatch({
      type: apiActions.API_CALL_FAILURE,
      payload: { api: type },
      errorData
    }).then(() => failureCallback(errorData));
  }
};

export default apiActionCreator;
