import { useReducer, Dispatch, useMemo } from 'react';

/**
 * base methods used in reducers or effect
 */
export interface MethodMapBase {
    [actionType: string]: (
        ...args: any[]
    ) => any;
}

export type EffectMethodBase = ({ state, actions }: { state: any, actions: any }) => MethodMapBase;

export interface StateAndAction<S, R extends MethodMapBase = any> {
    state: S;
    actions: ActionMap<R>;
}
// action type get from  ReducerMap
export type ActionUnion<R extends MethodMapBase> = {
    [T in keyof R]: { type: T; payload: Parameters<R[T]>[1] };
}[keyof R];

/**
 * action fuction, auto create by ReducerMap
 * call action = dispath({type: 'TYPE', payload: any});
 */
export type ActionMap<R extends MethodMapBase> = {
    [K in keyof R]: (payload?: ActionUnion<R>['payload']) => void;
};

/**
 * function map, map's key as action type, value as reduce
 */
export type ReducerMap<S = any, R extends MethodMapBase = MethodMapBase> = {
    [K in keyof R]: (prevState: S, payload?: any) => S;
};

/**
 * return EffectMap
 */
export type EffectInitializer<S, R extends MethodMapBase, E extends EffectMethodBase> =
    ({ state, actions }: StateAndAction<S, R>) => ReturnType<E>;

export interface Model<S, R extends MethodMapBase, E extends EffectMethodBase> {
    state: S | any;
    reducers: ReducerMap<S, R>;
    effects?: EffectInitializer<S, R, E>;
    initializer?: any;
    debug?: boolean;
}

export default function useModel<S, R extends MethodMapBase, E extends EffectMethodBase = any>({
    state: initialState,
    reducers: reducerMap,
    effects: effectInitializer,
    initializer,
    debug = false,
}: Model<S, R, E>): [
    S,
    ActionMap<R>,
    E extends EffectMethodBase ? ReturnType<E> : undefined
] {
    const [state, dispatch] = useReducer(
        makeReducer<Model<S, R, E>['state'], Model<S, R, E>['reducers']>(reducerMap),
        initialState,
        initializer,
    );
    const actions = useMemo(() => makeActions<S, R>(dispatch, reducerMap, debug), [
        reducerMap,
    ]);
    let effectsAction: any = effectInitializer
            ? effectInitializer({ state, actions })
            : undefined;

    return [state, actions, effectsAction];
}

export function makeReducer<S, R extends MethodMapBase>(
    reducerMap: ReducerMap<S, R>,
) {
    return (state: S, action: ActionUnion<R>) => {
        // if the dispatched action is valid and there's a matching reducer, use it
        if (action && action.type && reducerMap[action.type]) {
            return reducerMap[action.type](state, action.payload);
        } else {
            // always return state if the action has no reducer
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
        // if there isn't already an action with this type
        if (!actions[type]) {
            // dispatches action with type and payload when called
            actions[type] = (payload: any) => {
                const action = { type, payload };
                dispatch(action);
                // optionally log actions
                if (debug) {
                    // tslint:disable-next-line
                    console.log(action);
                }
            };
        }
        return actions;
    }, {} as ActionMap<R>);
}

