import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './useDebounce';

beforeEach(() => {
   vi.useFakeTimers();
});

afterEach(() => {
   vi.useRealTimers();
});

describe('useDebounce', () => {
   it('returns the initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('hello'));
      expect(result.current).toBe('hello');
   });

   it('does not update value before the delay elapses', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
         initialProps: { value: 'hello' },
      });

      rerender({ value: 'world' });

      act(() => { vi.advanceTimersByTime(100); });

      expect(result.current).toBe('hello');
   });

   it('updates value after the default 300ms delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
         initialProps: { value: 'hello' },
      });

      rerender({ value: 'world' });

      act(() => { vi.advanceTimersByTime(300); });

      expect(result.current).toBe('world');
   });

   it('resets the timer on rapid successive changes', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
         initialProps: { value: 'a' },
      });

      rerender({ value: 'b' });
      act(() => { vi.advanceTimersByTime(100); });

      rerender({ value: 'c' });
      act(() => { vi.advanceTimersByTime(100); });

      // Only 200ms since last change — should not have updated yet
      expect(result.current).toBe('a');

      act(() => { vi.advanceTimersByTime(200); });

      expect(result.current).toBe('c');
   });

   it('respects a custom delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 1000), {
         initialProps: { value: 'hello' },
      });

      rerender({ value: 'world' });

      act(() => { vi.advanceTimersByTime(999); });
      expect(result.current).toBe('hello');

      act(() => { vi.advanceTimersByTime(1); });
      expect(result.current).toBe('world');
   });

   it('works with numeric values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
         initialProps: { value: 0 },
      });

      rerender({ value: 42 });
      act(() => { vi.advanceTimersByTime(300); });

      expect(result.current).toBe(42);
   });
});
