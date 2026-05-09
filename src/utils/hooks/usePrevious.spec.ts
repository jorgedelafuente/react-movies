import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
   it('returns undefined on the first render', () => {
      const { result } = renderHook(() => usePrevious('hello'));
      expect(result.current).toBeUndefined();
   });

   it('returns the previous string value after an update', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
         initialProps: { value: 'first' },
      });

      rerender({ value: 'second' });

      expect(result.current).toBe('first');
   });

   it('tracks each successive value correctly', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
         initialProps: { value: 'a' },
      });

      rerender({ value: 'b' });
      expect(result.current).toBe('a');

      rerender({ value: 'c' });
      expect(result.current).toBe('b');
   });

   it('works with numeric values', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
         initialProps: { value: 1 },
      });

      rerender({ value: 2 });
      expect(result.current).toBe(1);
   });

   it('works with object values', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };

      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
         initialProps: { value: obj1 },
      });

      rerender({ value: obj2 });
      expect(result.current).toBe(obj1);
   });
});
