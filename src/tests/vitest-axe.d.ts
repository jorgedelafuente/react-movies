import { AxeResults } from 'axe-core';
import { Assertion } from 'vitest';

declare module 'vitest' {
   interface Assertion<T = any> {
      toHaveNoViolations(): T;
   }
   interface AsymmetricMatchersContaining {
      toHaveNoViolations(): AxeResults;
   }
}
