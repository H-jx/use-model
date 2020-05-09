
import { fromJS, List, Record } from 'immutable';
import * as React from 'react';
import useModel, {Model, ActionMap, setReducerHanlder} from '../src/index';


interface State {
    count: number;
    items: number[];
}
const initialState: Record<State>  = fromJS({ count: 0, items: List() });
const reducers = {
    increment: (state: Record<State>, payload?: number) => {
        return state.set('count', state.get('count') + 1)

    },
    decrement: (state: Record<State>, payload?: number) => {
        return state.set('count', state.get('count') - 1)
    },
};
export function UseImmutable() {
    setReducerHanlder(function({ preState, payload, redurcer }) {
        return redurcer(preState, payload);
    });
    const [state, actions] = useModel<Model<Record<State>, typeof reducers>>({
        state: initialState,
        reducers,
    });
    return {
        state,
        ...actions
    };
}
