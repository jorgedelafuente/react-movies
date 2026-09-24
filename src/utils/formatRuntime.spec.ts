import { formatRuntime } from './formatRuntime';

describe('formatRuntime', () => {
   it('shows minutes only under an hour', () => {
      expect(formatRuntime(45)).toBe('45m');
   });

   it('drops the minutes on a whole hour', () => {
      expect(formatRuntime(60)).toBe('1h');
      expect(formatRuntime(120)).toBe('2h');
   });

   it('combines hours and minutes', () => {
      expect(formatRuntime(128)).toBe('2h 8m');
   });
});
