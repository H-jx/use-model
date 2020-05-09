import produce from 'immer';
import * as React from 'react';
import useModel, {Model, ActionMap, setReducerHanlder} from '../src/index';


interface State {
    count: number;
}
const initialState = { count: 0};

const reducers = {
    increment: (state: State, payload?: number) => {
        state.count = state.count + 1;
    },
    decrement: (state: State, payload?: number) => {
        state.count = state.count - 1;
    },
};
export function UseImmer() {
    setReducerHanlder(function({ preState, payload, redurcer }) {
        return (produce as any)(
            preState,
            (draft: State) => redurcer(draft, payload),
        );
    });
    const [state, actions] = useModel({
        state: initialState,
        reducers,
    });
    
    return {
        state,
        ...actions
    };
}
