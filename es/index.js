import { useReducer, useMemo } from 'react';
export default function useReduction(_a) {
    var initialState = _a.state, reducerMap = _a.reducers, effectInitializer = _a.effects, initializer = _a.initializer, _b = _a.debug, debug = _b === void 0 ? false : _b;
    var _c = useReducer(makeReducer(reducerMap), initialState, initializer), state = _c[0], dispatch = _c[1];
    var actions = useMemo(function () { return makeActions(dispatch, reducerMap, debug); }, [
        reducerMap,
    ]);
    var effectsAction = effectInitializer
        ? effectInitializer({ state: state, actions: actions })
        : undefined;
    return [state, actions, effectsAction];
}
export function makeReducer(reducerMap) {
    return function (state, action) {
        // if the dispatched action is valid and there's a matching reducer, use it
        if (action && action.type && reducerMap[action.type]) {
            return reducerMap[action.type](state, action.payload);
        }
        else {
            // always return state if the action has no reducer
            return state;
        }
    };
}
export function makeActions(dispatch, reducerMap, debug) {
    var types = Object.keys(reducerMap);
    return types.reduce(function (actions, type) {
        // if there isn't already an action with this type
        if (!actions[type]) {
            // dispatches action with type and payload when called
            actions[type] = function (payload) {
                var action = { type: type, payload: payload };
                dispatch(action);
                // optionally log actions
                if (debug) {
                    // tslint:disable-next-line
                    console.log(action);
                }
            };
        }
        return actions;
    }, {});
}
