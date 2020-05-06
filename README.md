## Installation
```bash
npm install use-easy-model
```

## Usage

```javascript
import useModel, { StateAndAction, Model } from 'use-easy-model';

interface State {
    count: number;
}

const initialState: State = {count: 1};

const reducers = {
  increment: (state: State, payload: number = 1) => {
      return {count: state.count + payload};
  },
  decrement: (state: State, payload: number = -1) => {
      return {count: state.count + payload};
  })
};

const effects = ({state, actions}) => ({
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

const model: Model<State, typeof reducers, typeof effects> = {state: initialState, reducers, effects}

const [state, reducerActions, effectsActions] = useModel({
    state: initialState,
    reducers
    effects
});

// will call reducers.increment
reducerActions.increment(1);

// will call effects.callEffect
effectsActions.callEffect();
```