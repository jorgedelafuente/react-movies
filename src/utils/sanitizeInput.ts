/**
 * sanitizeInput
 * @param input string
 * @returns returns string but only allows letters, number and spaces
 */

export const sanitizeInput = (input: string) => {
   return input.replace(/[^a-zA-Z0-9 ]/g, '');
};
