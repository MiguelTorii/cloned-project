import type { Reducers } from "../reducers";
type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V; // eslint-disable-line flowtype/no-weak-types

export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;