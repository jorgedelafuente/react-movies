import type { ReleaseDatesByCountryType } from '@/types/films.schemas';
import {
   flattenReleaseDates,
   formatReleaseDate,
   pickCertification,
   releaseTypeLabel,
} from '@/utils/releaseDates';

type Props = { results?: ReleaseDatesByCountryType[] };

/** Age rating chip, e.g. "PG-13 · US". Renders nothing when no country has one. */
export const CertificationBadge = ({ results }: Props) => {
   const certification = pickCertification(results);
   if (!certification) return null;
   return (
      <span
         className="rounded-md border border-copy/40 px-2 py-0.5 text-sm font-semibold tabular-nums"
         title={`Age rating in ${certification.region}`}
         data-testid="certification-badge"
      >
         {certification.rating}
         <span className="ml-1 text-xs font-normal opacity-70">
            {certification.region}
         </span>
      </span>
   );
};

/** Collapsible per-country release list. Stacked rows so it works on mobile. */
export const ReleaseDatesList = ({ results }: Props) => {
   const rows = flattenReleaseDates(results);
   if (rows.length === 0) return null;
   return (
      <details className="mt-3 rounded-md border border-copy/20 p-2">
         <summary className="cursor-pointer select-none font-semibold">
            Release dates
            <span className="ml-2 text-sm font-normal opacity-70">
               ({rows.length})
            </span>
         </summary>
         <ul className="mt-2 flex flex-col divide-y divide-copy/10 text-sm">
            {rows.map((row) => (
               <li
                  key={`${row.region}-${row.type}-${row.release_date}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-1.5"
               >
                  <span className="min-w-[8rem] font-medium">
                     {row.country}
                  </span>
                  <span className="opacity-80">
                     {releaseTypeLabel(row.type)}
                  </span>
                  <span className="tabular-nums opacity-80">
                     {formatReleaseDate(row.release_date)}
                  </span>
                  {row.certification && (
                     <span className="rounded border border-copy/30 px-1 text-xs tabular-nums">
                        {row.certification}
                     </span>
                  )}
                  {row.note && (
                     <span className="w-full text-xs italic opacity-60 sm:w-auto">
                        {row.note}
                     </span>
                  )}
               </li>
            ))}
         </ul>
      </details>
   );
};
