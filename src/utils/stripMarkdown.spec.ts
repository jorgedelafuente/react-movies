import { stripMarkdown } from './stripMarkdown';

describe('stripMarkdown', () => {
   it('unwraps bold and italic emphasis', () => {
      expect(stripMarkdown('**Deadpool & Wolverine: A Dream Realized**')).toBe(
         'Deadpool & Wolverine: A Dream Realized'
      );
      expect(stripMarkdown('From the start, _Deadpool_ bursts in.')).toBe(
         'From the start, Deadpool bursts in.'
      );
      expect(stripMarkdown('It was *fine* (really *fine*).')).toBe(
         'It was fine (really fine).'
      );
      expect(stripMarkdown('***loud***')).toBe('loud');
   });

   it('leaves underscores and asterisks inside words alone', () => {
      expect(stripMarkdown('the file_name_here and 2*3*4')).toBe(
         'the file_name_here and 2*3*4'
      );
   });

   it('keeps link labels and drops URLs', () => {
      expect(
         stripMarkdown('See [my blog](https://example.com/x) for more')
      ).toBe('See my blog for more');
   });

   it('removes headings and simple inline HTML', () => {
      expect(
         stripMarkdown('## Verdict\nGreat <em>fun</em>.<br>Go see it.')
      ).toBe('Verdict\nGreat fun.\nGo see it.');
   });

   it('normalises newlines and trims', () => {
      expect(stripMarkdown('  One.\r\n\r\n\r\n\r\nTwo.  ')).toBe(
         'One.\n\nTwo.'
      );
   });
});
