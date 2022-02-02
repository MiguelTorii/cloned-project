import { createBrowserHistory } from 'history';
import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import createRootReducer from 'reducers';
import apiActionCreator from 'redux/middleware/apiActionCreator';

export const history = createBrowserHistory();

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: (getDefaultMiddleware) =>
    // TODO Remove Chat client, Channel objects from state & find source of circular dependency
    // All state should be serializable and there should be no large objects in the state.
    // Not having these set as false creates a 'Maximum call stack size' error
    // As RTK is properly tracking state changes with redux-immutable-state-invariant
    // There is likely a circular dependency in the state or a hook continuously updating data.
    // This just was not noticed in previous versions.
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })
      .concat(routerMiddleware(history))
      .concat(apiActionCreator)
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { useSelector, useDispatch };

export default store;
