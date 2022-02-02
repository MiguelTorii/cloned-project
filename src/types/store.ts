import type { Store as ReduxStore, Dispatch as ReduxDispatch } from '@reduxjs/toolkit';
import type { Action } from './action';
import type { State } from './state';

export type Store = ReduxStore<State, Action>;
export type GetState = () => State;
export type Dispatch = ReduxDispatch<Action> & Thunk<Action>; // eslint-disable-line no-use-before-define

export type Thunk<A> = (arg0: (arg0: Dispatch, arg1: GetState) => Promise<void> | void) => A;
