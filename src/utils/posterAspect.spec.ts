import {
   DEFAULT_POSTER_ASPECT,
   masonryAspect,
   POSTER_ASPECTS,
} from './posterAspect';

describe('masonryAspect', () => {
   it('starts the list with the plain poster crop', () => {
      expect(masonryAspect(0)).toBe(DEFAULT_POSTER_ASPECT);
   });

   it('only ever returns one of the known ratios', () => {
      for (let index = 0; index < 40; index++) {
         expect(POSTER_ASPECTS).toContain(masonryAspect(index));
      }
   });

   it('uses all three ratios within one TMDB page of 20 cards', () => {
      const used = new Set(
         Array.from({ length: 20 }, (_, index) => masonryAspect(index))
      );
      expect(used).toEqual(new Set(POSTER_ASPECTS));
   });

   it('never places two shorter crops next to each other', () => {
      for (let index = 0; index < 40; index++) {
         const pair = [masonryAspect(index), masonryAspect(index + 1)];
         expect(pair).toContain(DEFAULT_POSTER_ASPECT);
      }
   });

   it('repeats so the pattern holds for any list length', () => {
      for (let index = 0; index < 40; index++) {
         expect(masonryAspect(index + 7)).toBe(masonryAspect(index));
      }
   });
});
