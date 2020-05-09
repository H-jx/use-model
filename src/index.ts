import { useReducer, Dispatch, useMemo } from 'react';

export interface MethodMapBase {
    [actionType: string]: (
        ...args: any[]
    ) => any;
}

export interface StateAndAction<S, R extends MethodMapBase = any> {
    state: S;
    actions: ActionMap<R>;
}
export type ActionUnion<R extends MethodMapBase> = {
    [T in keyof R]: { type: T; payload: Parameters<R[T]>[1] };
}[keyof R];

export type ActionMap<R extends MethodMapBase> = {
    [K in keyof R]: (payload?: ActionUnion<R>['payload']) => void;
};

/**
 * function map, map's key as action type, value as reduce
 */
export type ReducerMap<S = any, R extends MethodMapBase = MethodMapBase> = {
    [K in keyof R]: (prevState: S, payload?: any) => any;
};

export type EffectMethodBase = ({ state, actions }: { state: any, actions: any }) => MethodMapBase;

/**
 * return EffectMap
 */
export type EffectInitializer<S, A, E extends EffectMethodBase> =
    ({ state, actions }: {state: S, actions: A}) => ReturnType<E>;

export interface Model<S, R extends MethodMapBase, E extends EffectMethodBase = EffectMethodBase> {
    state: S | any;
    reducers: ReducerMap<S, R>;
    effects?: E;
    initializer?: any;
    debug?: boolean;
}


export default function useModel<M extends Model<any, MethodMapBase>>({
    state: initialState,
    reducers: reducerMap,
    effects: effectInitializer,
    initializer,
    debug = false,
}: M): [
    M['state'],
    ActionMap<M['reducers']>,
    M['effects'] extends EffectMethodBase ? ReturnType<M['effects']> : undefined
] {
    const [state, dispatch] = useReducer(
        makeReducer<M['state'], M['reducers']>(reducerMap),
        initialState,
        initializer,
    );
    const actions = useMemo(() => makeActions<M['state'], M['reducers']>(dispatch, reducerMap, debug), [
        reducerMap,
    ]);
    let effectsAction: any = effectInitializer
            ? effectInitializer({ state, actions })
            : undefined;

    return [state, actions, effectsAction];
}

let reducerHanlder = function ({preState, payload, redurcer}: {
    preState: any,
    payload: any,
    redurcer: (preState: any, payload: any) => any;
}) {
    return redurcer(preState, payload);
}
export function makeReducer<S, R extends MethodMapBase>(
    reducerMap: ReducerMap<S, R>,
) {
    return (state: S, action: ActionUnion<R>) => {
        if (action && action.type && reducerMap[action.type]) {
            return reducerHanlder({preState: state, payload: action.payload, redurcer: reducerMap[action.type]});
        } else {
            return state;
        }
    };
}

export function makeActions<S, R extends MethodMapBase>(
    dispatch: Dispatch<ActionUnion<R>>,
    reducerMap: ReducerMap<S, R>,
    debug: boolean,
): ActionMap<R> {
    const types = Object.keys(reducerMap) as (keyof R)[];
    return types.reduce((actions: ActionMap<R>, type: keyof R) => {
        if (!actions[type]) {
            actions[type] = (payload: any) => {
                const action = { type, payload };
                dispatch(action);
                if (debug) {
                    // tslint:disable-next-line
                    console.log(action);
                }
            };
        }
        return actions;
    }, {} as ActionMap<R>);
}

export function setReducerHanlder(handle: ({preState, payload, redurcer}: {
    preState: any,
    payload: any,
    redurcer: (state: any, payload: any) => any;
}) => any) {
    reducerHanlder = handle;
}