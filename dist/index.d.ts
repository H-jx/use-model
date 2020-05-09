import { Dispatch } from 'react';
export interface MethodMapBase {
    [actionType: string]: (...args: any[]) => any;
}
export interface StateAndAction<S, R extends MethodMapBase = any> {
    state: S;
    actions: ActionMap<R>;
}
export declare type ActionUnion<R extends MethodMapBase> = {
    [T in keyof R]: {
        type: T;
        payload: Parameters<R[T]>[1];
    };
}[keyof R];
export declare type ActionMap<R extends MethodMapBase> = {
    [K in keyof R]: (payload?: ActionUnion<R>['payload']) => void;
};
/**
 * function map, map's key as action type, value as reduce
 */
export declare type ReducerMap<S = any, R extends MethodMapBase = MethodMapBase> = {
    [K in keyof R]: (prevState: S, payload?: any) => any;
};
export declare type EffectMethodBase = ({ state, actions }: {
    state: any;
    actions: any;
}) => MethodMapBase;
/**
 * return EffectMap
 */
export declare type EffectInitializer<S, A, E extends EffectMethodBase> = ({ state, actions }: {
    state: S;
    actions: A;
}) => ReturnType<E>;
export interface Model<S, R extends MethodMapBase, E extends EffectMethodBase = EffectMethodBase> {
    state: S | any;
    reducers: ReducerMap<S, R>;
    effects?: E;
    initializer?: any;
    debug?: boolean;
}
export default function useModel<M extends Model<any, MethodMapBase>>({ state: initialState, reducers: reducerMap, effects: effectInitializer, initializer, debug, }: M): [M['state'], ActionMap<M['reducers']>, M['effects'] extends EffectMethodBase ? ReturnType<M['effects']> : undefined];
export declare function makeReducer<S, R extends MethodMapBase>(reducerMap: ReducerMap<S, R>): (state: S, action: { [T in keyof R]: {
    type: T;
    payload: Parameters<R[T]>[1];
}; }[keyof R]) => any;
export declare function makeActions<S, R extends MethodMapBase>(dispatch: Dispatch<ActionUnion<R>>, reducerMap: ReducerMap<S, R>, debug: boolean): ActionMap<R>;
export declare function setReducerHanlder(handle: ({ preState, payload, redurcer }: {
    preState: any;
    payload: any;
    redurcer: (state: any, payload: any) => any;
}) => any): void;
