## Installation
```bash
npm install use-easy-model
```

## Usage

```javascript
import useModel, { StateAndAction, Model } from 'ROOT/libs/use-easy-model';

const initialState: State = {count: 1};

const reducers = {
  increment: (state: State, payload: number) => Object.assign({}, state, state.count + payload})
  decrement: (state: State, payload: number) => Object.assign({}, state, state.count - payload})
};

const effects = ({state, actions}: StateAndAction<State, typeof reducers>) => ({
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
const [state, reducerActions, effectsActions] = useModel(model);

// will call reducers.increment
reducerActions.increment(1);

// will call effects.callEffect
effectsActions.callEffect();
```