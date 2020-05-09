import * as React from 'react';
import useModel, {Model, ActionMap} from '../src/index';


interface State {
    count: number;
}
const initialState = { count: 0 };

const reducers = {
    increment: (state: State, payload?: number) => {
        return {count: state.count + 1};
    },
    decrement: (state: State, payload?: number) => {
        return {count: state.count - 1};
    },
};
const effects = ({state, actions}: {state: State, actions: ActionMap<typeof reducers>}) => ({
    callEffect () {
        setTimeout(() => {
            this.delay('');
        }, 1000);
    },
    async delay (payload: string) {
        setTimeout(() => {
             actions.increment(3);
        }, 1000);
    },
});
export function useCounter() {
    const [state, actions, effectsActions] = useModel({
        state: initialState,
        reducers,
        effects,
    });
    
    return {
        state,
        ...actions
    };
}

export function Counter() {
    const { state, ...actions} = useCounter();
    return (
        <>
            <span>Count: {state.count}</span>
            <button onClick={() => actions.increment()}>increment</button>
            <button onClick={() => actions.decrement()}>increment</button>
        </>
    );
}