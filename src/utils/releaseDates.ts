import type {
   ReleaseDatesByCountryType,
   ReleaseDateType,
} from '@/types/films.types';

/** TMDB release `type` codes. */
export const RELEASE_TYPE_LABELS: Record<number, string> = {
   1: 'Premiere',
   2: 'Limited theatrical',
   3: 'Theatrical',
   4: 'Digital',
   5: 'Physical',
   6: 'TV',
};

export const releaseTypeLabel = (type: number) =>
   RELEASE_TYPE_LABELS[type] ?? 'Release';

const FALLBACK_REGION = 'US';

/** Region from the browser locale (e.g. `es-ES` -> `ES`), else US. */
export const getPreferredRegion = (
   locale: string | undefined = typeof navigator !== 'undefined'
      ? navigator.language
      : undefined
): string => {
   if (!locale) return FALLBACK_REGION;
   try {
      return new Intl.Locale(locale).region ?? FALLBACK_REGION;
   } catch {
      return FALLBACK_REGION;
   }
};

const regionNames =
   typeof Intl !== 'undefined' && 'DisplayNames' in Intl
      ? new Intl.DisplayNames(['en'], { type: 'region' })
      : undefined;

export const regionName = (iso: string): string => {
   try {
      return regionNames?.of(iso) ?? iso;
   } catch {
      return iso;
   }
};

export type Certification = { rating: string; region: string };

/**
 * Picks the age rating to headline: the user's region first, then US, then
 * the first country that has one at all.
 */
export const pickCertification = (
   results: ReleaseDatesByCountryType[] | undefined,
   preferredRegion: string = getPreferredRegion()
): Certification | undefined => {
   if (!results?.length) return undefined;
   const order = [preferredRegion, FALLBACK_REGION];
   const withRating = results
      .map((country) => ({
         region: country.iso_3166_1,
         rating:
            country.release_dates.find((r) => r.certification.trim() !== '')
               ?.certification ?? '',
      }))
      .filter((c) => c.rating !== '');

   for (const region of order) {
      const hit = withRating.find((c) => c.region === region);
      if (hit) return hit;
   }
   return withRating[0];
};

export type ReleaseRow = ReleaseDateType & { region: string; country: string };

/**
 * Flattens countries into one row per release, preferred region first and
 * the rest alphabetical by country name, each country's releases by date.
 */
export const flattenReleaseDates = (
   results: ReleaseDatesByCountryType[] | undefined,
   preferredRegion: string = getPreferredRegion()
): ReleaseRow[] => {
   if (!results?.length) return [];
   return [...results]
      .map((country) => ({
         ...country,
         country: regionName(country.iso_3166_1),
      }))
      .sort((a, b) => {
         if (a.iso_3166_1 === preferredRegion) return -1;
         if (b.iso_3166_1 === preferredRegion) return 1;
         return a.country.localeCompare(b.country);
      })
      .flatMap((country) =>
         [...country.release_dates]
            .sort((a, b) => a.release_date.localeCompare(b.release_date))
            .map((release) => ({
               ...release,
               region: country.iso_3166_1,
               country: country.country,
            }))
      );
};

export const formatReleaseDate = (iso: string) => {
   const d = new Date(iso);
   return isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString('en-GB', {
           day: '2-digit',
           month: 'short',
           year: 'numeric',
        });
};
