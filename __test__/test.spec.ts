import {useCounter} from './Counter';
import { renderHook, act } from '@testing-library/react-hooks'

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