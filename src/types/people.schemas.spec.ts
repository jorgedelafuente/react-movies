import { MOCK_PERSON_INFO } from '@/tests/mocks/people.mocks';

import { MEDIA_TYPES } from './media.types';
import { PersonInfoSchema } from './people.schemas';

describe('PersonInfoSchema', () => {
   it('parses the person with appended external ids and credits', () => {
      const person = PersonInfoSchema.parse(MOCK_PERSON_INFO);
      expect(person.name).toBe('Emilia Clarke');
      expect(person.external_ids?.imdb_id).toBe('nm3592338');
      expect(person.combined_credits?.cast).toHaveLength(4);
      expect(person.combined_credits?.crew).toHaveLength(1);
   });

   it('normalises TV credits (name / first_air_date) onto the card shape', () => {
      const person = PersonInfoSchema.parse(MOCK_PERSON_INFO);
      const got = person.combined_credits!.cast[0];
      expect(got).toMatchObject({
         id: 1399,
         media_type: MEDIA_TYPES.TV,
         title: 'Game of Thrones',
         release_date: '2011-04-17',
         character: 'Daenerys Targaryen',
         episode_count: 73,
      });
   });

   it('keeps movie credits as they are and blanks a missing date', () => {
      const person = PersonInfoSchema.parse(MOCK_PERSON_INFO);
      const solo = person.combined_credits!.cast[2];
      expect(solo).toMatchObject({
         media_type: MEDIA_TYPES.MOVIE,
         title: 'Solo: A Star Wars Story',
         release_date: '2018-05-15',
         character: "Qi'ra",
      });
      expect(person.combined_credits!.cast[3].release_date).toBe('');
   });

   it('carries the job on crew credits', () => {
      const person = PersonInfoSchema.parse(MOCK_PERSON_INFO);
      expect(person.combined_credits!.crew[0]).toMatchObject({
         title: 'Behind the Throne',
         job: 'Executive Producer',
         department: 'Production',
      });
   });

   it('tolerates a person without credits or external ids', () => {
      const { combined_credits, external_ids, ...bare } = MOCK_PERSON_INFO;
      void combined_credits;
      void external_ids;
      const person = PersonInfoSchema.parse(bare);
      expect(person.combined_credits).toBeUndefined();
      expect(person.external_ids).toBeUndefined();
   });
});
