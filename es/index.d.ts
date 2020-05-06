import { Dispatch } from 'react';
/**
 * base methods used in reducers or effect
 */
export interface MethodMapBase {
    [actionType: string]: (...args: any[]) => any;
}
export declare type EffectMethodBase = ({ state, actions }: {
    state: any;
    actions: any;
}) => MethodMapBase;
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
/**
 * action fuction, auto create by ReducerMap
 * call action = dispath({type: 'TYPE', payload: any});
 */
export declare type ActionMap<R extends MethodMapBase> = {
    [K in keyof R]: (payload?: ActionUnion<R>['payload']) => void;
};
/**
 * async action, auto create by EffectMap
 */
export declare type EffectActionMap<EffectMethods extends MethodMapBase = MethodMapBase> = {
    [K in keyof EffectMethods]: (...arg: Parameters<EffectMethods[K]>) => ReturnType<EffectMethods[K]>;
};
/**
 * function map, map's key as action type, value as reduce
 */
export declare type ReducerMap<S = any, R extends MethodMapBase = MethodMapBase> = {
    [K in keyof R]: (prevState: S, payload?: any) => S;
};
/**
 * async action, you can call action in effect with async function
 */
export declare type EffectMap<EffectMethods extends MethodMapBase = MethodMapBase> = EffectActionMap<EffectMethods>;
/**
 * return EffectMap
 */
export declare type EffectInitializer<S, R extends MethodMapBase, E extends EffectMethodBase> = ({ state, actions }: StateAndAction<S, R>) => EffectMap<ReturnType<E>>;
export interface Model<S, R extends MethodMapBase, E extends EffectMethodBase> {
    state: S | any;
    reducers: ReducerMap<S, R>;
    effects?: EffectInitializer<S, R, E>;
    initializer?: any;
    debug?: boolean;
}
export default function useModel<S, R extends MethodMapBase, E extends EffectMethodBase = any>({ state: initialState, reducers: reducerMap, effects: effectInitializer, initializer, debug, }: Model<S, R, E>): [S, ActionMap<R>, E extends EffectMethodBase ? EffectActionMap<ReturnType<E>> : undefined];
export declare function makeReducer<S, R extends MethodMapBase>(reducerMap: ReducerMap<S, R>): (state: S, action: { [T in keyof R]: {
    type: T;
    payload: Parameters<R[T]>[1];
}; }[keyof R]) => S;
export declare function makeActions<S, R extends MethodMapBase>(dispatch: Dispatch<ActionUnion<R>>, reducerMap: ReducerMap<S, R>, debug: boolean): ActionMap<R>;
