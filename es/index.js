import { useReducer, useMemo } from 'react';

function useModel(_a) {
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
var reducerHanlder = function (_a) {
    var preState = _a.preState, payload = _a.payload, redurcer = _a.redurcer;
    return redurcer(preState, payload);
};
function makeReducer(reducerMap) {
    return function (state, action) {
        if (action && action.type && reducerMap[action.type]) {
            return reducerHanlder({ preState: state, payload: action.payload, redurcer: reducerMap[action.type] });
        }
        else {
            return state;
        }
    };
}
function makeActions(dispatch, reducerMap, debug) {
    var types = Object.keys(reducerMap);
    return types.reduce(function (actions, type) {
        if (!actions[type]) {
            actions[type] = function (payload) {
                var action = { type: type, payload: payload };
                dispatch(action);
                if (debug) {
                    // tslint:disable-next-line
                    console.log(action);
                }
            };
        }
        return actions;
    }, {});
}
function setReducerHanlder(handle) {
    reducerHanlder = handle;
}

export default useModel;
export { makeActions, makeReducer, setReducerHanlder };
