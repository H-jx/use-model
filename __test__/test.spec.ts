import { renderHook, act } from '@testing-library/react-hooks'
import { fromJS, List } from 'immutable';
import {useCounter} from './Counter';
import {UseImmer} from './UseImmer';
import { UseImmutable } from './UseImmutable';

test('should increment counter', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })
  
    expect(result.current.state.count).toBe(1)
})

test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.decrement()
    })
  
    expect(result.current.state.count).toBe(-1)
})

test('useImmer', () => {
  const { result } = renderHook(() => UseImmer())

  act(() => {
    result.current.decrement()
  })

  expect(result.current.state.count).toBe(-1)
})

test('useImmutable', () => {
  const { result } = renderHook(() => UseImmutable())

  act(() => {
    result.current.decrement()
  })
  expect(result.current.state.toJS().count).toBe(-1)
})