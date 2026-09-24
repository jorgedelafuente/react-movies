/**
 * TMDB review text is user-written and often carries light markdown or
 * stray HTML. We render reviews as plain text, so this removes the most
 * common markers rather than pulling in a markdown renderer. It is
 * deliberately conservative: emphasis is only unwrapped when the marker sits
 * at a word boundary, so snake_case words and maths stay intact.
 */
export const stripMarkdown = (text: string): string =>
   text
      // Line breaks and a few inline tags that show up in older reviews.
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(?:em|strong|b|i|u|p|span)\b[^>]*>/gi, '')
      // Links: keep the label, drop the URL.
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // ATX headings at the start of a line.
      .replace(/^#{1,6}[ \t]+/gm, '')
      // Bold and bold-italic markers.
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      // Italics, only when wrapped at word boundaries.
      .replace(/(^|[\s(])_([^_\n]+?)_(?=$|[\s.,;:!?)])/gm, '$1$2')
      .replace(/(^|[\s(])\*([^*\n]+?)\*(?=$|[\s.,;:!?)])/gm, '$1$2')
      // Collapse Windows newlines and runs of blank lines.
      .replace(/\r\n?/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
