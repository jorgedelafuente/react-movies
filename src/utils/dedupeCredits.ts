import type { PersonCreditType } from '@/types/people.types';

export type DedupedCredit = PersonCreditType & { roles: string[] };

/**
 * TMDB lists the same title once per character or job. Collapse to one entry
 * per title, joining the roles, and order newest first with undated items last.
 */
export const dedupeCredits = (
   credits: PersonCreditType[],
   roleOf: (c: PersonCreditType) => string | undefined
): DedupedCredit[] => {
   const byKey = new Map<string, DedupedCredit>();
   for (const credit of credits) {
      const key = `${credit.media_type}-${credit.id}`;
      const role = roleOf(credit)?.trim();
      const existing = byKey.get(key);
      if (existing) {
         if (role && !existing.roles.includes(role)) existing.roles.push(role);
      } else {
         byKey.set(key, { ...credit, roles: role ? [role] : [] });
      }
   }
   return [...byKey.values()].sort((a, b) => {
      if (!a.release_date && !b.release_date) return 0;
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return b.release_date.localeCompare(a.release_date);
   });
};
