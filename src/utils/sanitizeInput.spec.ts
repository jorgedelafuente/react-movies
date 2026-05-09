import { describe, expect, it } from 'vitest';

import { sanitizeInput } from './sanitizeInput';

describe('sanitizeInput', () => {
   it('passes through alphanumeric characters unchanged', () => {
      expect(sanitizeInput('abc123')).toBe('abc123');
   });

   it('preserves spaces', () => {
      expect(sanitizeInput('hello world')).toBe('hello world');
   });

   it('strips special characters', () => {
      expect(sanitizeInput('hello!')).toBe('hello');
      expect(sanitizeInput('test@example.com')).toBe('testexamplecom');
      expect(sanitizeInput('foo#bar$baz')).toBe('foobarbaz');
   });

   it('strips backticks', () => {
      expect(sanitizeInput('hello`world')).toBe('helloworld');
   });

   it('strips hyphens and underscores', () => {
      expect(sanitizeInput('hello-world')).toBe('helloworld');
      expect(sanitizeInput('hello_world')).toBe('helloworld');
   });

   it('returns empty string for input with only special characters', () => {
      expect(sanitizeInput('!@#$%^&*()')).toBe('');
   });

   it('returns empty string for empty input', () => {
      expect(sanitizeInput('')).toBe('');
   });

   it('handles mixed valid and invalid characters', () => {
      expect(sanitizeInput('  The Dark Knight (2008)  ')).toBe('  The Dark Knight 2008  ');
   });
});
