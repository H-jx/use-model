## Installation
```bash
npm install use-easy-model
```

## Usage

```js
import * as React from 'react';
import useModel from 'use-easy-model';
// if you don't like Object.assign at reducers,
// you can setReducerHanlder in global

// setReducerHanlder(({preState, payload, redurcer}) => {
//     return Object.assign({}, preState, redurcer(preState, payload))
// })

const model = {
    state: { count: 0, other: [] },
    reducers: {
        increment: (state, payload) => {
            return Object.assign({}, state, {count: state.count + 1});
        },
        decrement: (state, payload) => {
            return Object.assign({}, state, {count: state.count -1 1});
        },
    },
    effects: ({state, actions}) => ({
        callEffect () {
            setTimeout(() => {
                this.delay('');
            }, 1000);
        },
        async delay (payload) {
            setTimeout(() => {
                 actions.increment(3);
            }, 1000);
        },
    }),
}
export function Counter() {
    const [state, actions, effectsActions] = useModel(model);
    return (
        <>
            <span>Count: {state.count}</span>
            <button onClick={() => actions.increment()}>increment</button>
            <button onClick={() => actions.decrement()}>increment</button>
        </>
    );
}
```

### use TypeScript
```typescript
import useModel, { StateAndAction, Model } from 'use-easy-model';
import * as React from 'react';


setReducerHanlder(({preState, payload, redurcer}) => {
    return Object.assign({}, preState, redurcer(preState, payload))
})

interface State {
    count: number;
    list: number[];
}
const initialState = { count: 0, list:[] };

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
export function Counter() {
    const [state, actions, effectsActions] = useModel({
        state: initialState,
        reducers,
        effects,
    });

    return (
        <>
            <span>Count: {state.count}</span>
            <button onClick={() => actions.increment()}>increment</button>
            <button onClick={() => actions.decrement()}>increment</button>
            <button onClick={() => effectsActions.delay()}>delay</button>
        </>
    );
}

```

### use immer.js

```typescript
import produce from 'immer';
import * as React from 'react';
import useModel, {Model, setReducerHanlder} from 'use-easy-model';

// only set once in global
setReducerHanlder(function({ preState, payload, redurcer }) {
    return (produce as any)(
        preState,
        (draft: State) => redurcer(draft, payload),
    );
});

// other components
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
    const [state, actions] = useModel({
        state: initialState,
        reducers,
    });
    
    return {
        state,
        ...actions
    };
}

```

### use immutable

```typescript

import { fromJS, List, Record } from 'immutable';
import * as React from 'react';
import useModel, {Model, ActionMap, setReducerHanlder} from 'use-easy-model';
// only set once in global
setReducerHanlder(function({ preState, payload, redurcer }) {
    return redurcer(preState, payload);
});

// other components
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
    const [state, actions] = useModel<Model<Record<State>, typeof reducers>>({
        state: initialState,
        reducers,
    });
    return {
        state,
        ...actions
    };
}

```