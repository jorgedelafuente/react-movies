import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import Chip from '@/components/atoms/chip/chip.component';
import MediaLink from '@/components/atoms/link/media-link.component';
import MediaImage from '@/components/atoms/media-image/media-image.component';
import SortableHeader from '@/components/atoms/sortable-header/sortable-header.component';
import FavoriteButton from '@/components/favorite-button/favorite-button.component';
import Container from '@/components/layout/container/container.component';
import type { FavoriteRow } from '@/services/supabase/favorites';
import {
   FAVORITE_STATUS_LABELS,
   FAVORITE_STATUS_ORDER,
   type FavoriteStatus,
} from '@/types/favorites.types';
import {
   MEDIA_TYPE_LABELS,
   MEDIA_TYPE_PLURAL_LABELS,
   MEDIA_TYPES,
   type MediaType,
} from '@/types/media.types';
import { useFavorites } from '@/utils/hooks/useFavorites';

type SortKey = 'created_at' | 'film_release_date' | 'media_type';
type SortDir = 'asc' | 'desc';

/** `all` is the unfiltered tab, not a status a row can hold. */
const ALL = 'all' as const;

/**
 * Compact sibling of `FIELD_CONTROL` for the in-row status picker. The native
 * arrow is kept rather than swapped for the chevron the filter selects use:
 * one `<select>` per row makes the extra markup cost real, and the control is
 * small enough that the platform arrow reads better here.
 */
const ROW_SELECT =
   'h-8 rounded-md border border-solid border-bold/40 bg-neutral px-2 text-xs font-medium text-copy hover:border-bold/70 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const formatDate = (iso: string) => {
   if (!iso) return '—';
   const d = new Date(iso);
   return isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString('en-GB', {
           day: '2-digit',
           month: 'short',
           year: 'numeric',
        });
};

const extractYear = (dateStr: string) => {
   if (!dateStr) return '—';
   const year = dateStr.slice(0, 4);
   return /^\d{4}$/.test(year) ? year : '—';
};

const FavoritesView = () => {
   const { favorites, isLoading, setStatus } = useFavorites();
   const [sortKey, setSortKey] = useState<SortKey>('created_at');
   const [sortDir, setSortDir] = useState<SortDir>('desc');
   const [statusFilter, setStatusFilter] = useState<
      FavoriteStatus | typeof ALL
   >(ALL);
   const [typeFilter, setTypeFilter] = useState<MediaType | typeof ALL>(ALL);

   const handleSort = (key: SortKey) => {
      if (sortKey === key) {
         setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
         setSortKey(key);
         setSortDir('desc');
      }
   };

   // The type filter is applied first so the status counts describe what the
   // table would actually show, rather than the whole collection.
   const byType =
      typeFilter === ALL
         ? favorites
         : favorites.filter((f) => f.media_type === typeFilter);

   const visible =
      statusFilter === ALL
         ? byType
         : byType.filter((f) => f.status === statusFilter);

   const sorted = [...visible].sort((a: FavoriteRow, b: FavoriteRow) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
   });

   return (
      <Container>
         <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-left text-display-lg text-copy">
               My Favorites
            </h1>

            {isLoading && <p className="text-copy opacity-60">Loading…</p>}

            {!isLoading && favorites.length === 0 && (
               <div className="text-left text-copy">
                  <p className="mb-3 max-w-prose leading-relaxed">
                     You haven't saved any favorites yet. Browse films or series
                     and tap the heart icon to add them to your list.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <Link
                        to="/popular"
                        className="text-accent hover:underline"
                     >
                        Browse films
                     </Link>
                     <Link
                        to="/series/popular"
                        className="text-accent hover:underline"
                     >
                        Browse series
                     </Link>
                  </div>
               </div>
            )}

            {!isLoading && favorites.length > 0 && (
               <div className="mb-6 flex flex-col gap-4">
                  <div
                     role="group"
                     aria-label="Filter by status"
                     className="flex flex-wrap gap-2"
                  >
                     <Chip
                        selected={statusFilter === ALL}
                        onClick={() => setStatusFilter(ALL)}
                     >
                        All
                        <span className="tabular-nums opacity-70">
                           {byType.length}
                        </span>
                     </Chip>
                     {FAVORITE_STATUS_ORDER.map((status) => (
                        <Chip
                           key={status}
                           selected={statusFilter === status}
                           onClick={() => setStatusFilter(status)}
                        >
                           {FAVORITE_STATUS_LABELS[status]}
                           <span className="tabular-nums opacity-70">
                              {byType.filter((f) => f.status === status).length}
                           </span>
                        </Chip>
                     ))}
                  </div>

                  <div
                     role="group"
                     aria-label="Filter by type"
                     className="flex flex-wrap gap-2"
                  >
                     <Chip
                        selected={typeFilter === ALL}
                        onClick={() => setTypeFilter(ALL)}
                     >
                        All types
                     </Chip>
                     {[MEDIA_TYPES.MOVIE, MEDIA_TYPES.TV].map((mediaType) => (
                        <Chip
                           key={mediaType}
                           selected={typeFilter === mediaType}
                           onClick={() => setTypeFilter(mediaType)}
                        >
                           {MEDIA_TYPE_PLURAL_LABELS[mediaType]}
                        </Chip>
                     ))}
                  </div>
               </div>
            )}

            {!isLoading && favorites.length > 0 && sorted.length === 0 && (
               <p className="max-w-prose leading-relaxed text-copy opacity-70">
                  Nothing here yet. Move something into{' '}
                  {statusFilter === ALL
                     ? 'this list'
                     : FAVORITE_STATUS_LABELS[statusFilter]}{' '}
                  using the Status control on a row, or widen the filters above.
               </p>
            )}

            {!isLoading && sorted.length > 0 && (
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-copy">
                     <thead className="text-xs uppercase tracking-wider text-copy/70">
                        <tr className="border-b border-bold">
                           <th className="py-2 pr-4 font-semibold">Poster</th>
                           <th className="py-2 pr-4 font-semibold">Title</th>
                           <SortableHeader
                              className="py-2 pr-4 font-semibold"
                              buttonClassName="whitespace-nowrap hover:text-accent"
                              sorted={
                                 sortKey === 'media_type' ? sortDir : false
                              }
                              onSort={() => handleSort('media_type')}
                           >
                              Type
                           </SortableHeader>
                           <SortableHeader
                              className="py-2 pr-4 font-semibold"
                              buttonClassName="whitespace-nowrap hover:text-accent"
                              sorted={
                                 sortKey === 'film_release_date'
                                    ? sortDir
                                    : false
                              }
                              onSort={() => handleSort('film_release_date')}
                           >
                              Year
                           </SortableHeader>
                           <SortableHeader
                              className="py-2 pr-4 font-semibold"
                              buttonClassName="whitespace-nowrap hover:text-accent"
                              sorted={
                                 sortKey === 'created_at' ? sortDir : false
                              }
                              onSort={() => handleSort('created_at')}
                           >
                              Added
                           </SortableHeader>
                           <th className="py-2 pr-4 font-semibold">Status</th>
                           <th className="py-2 font-semibold">Remove</th>
                        </tr>
                     </thead>
                     <tbody>
                        {sorted.map((fav) => (
                           <tr
                              key={fav.id}
                              className="border-b border-bold/30 hover:bg-neutral-inverted/5"
                           >
                              <td className="py-2 pr-4">
                                 <MediaImage
                                    path={fav.film_poster_path}
                                    alt={fav.film_title || 'Poster'}
                                    className="h-16 w-10 rounded object-cover"
                                 />
                              </td>
                              <td className="max-w-xs py-2 pr-4">
                                 <MediaLink
                                    id={fav.film_id}
                                    mediaType={fav.media_type}
                                 >
                                    <span className="block truncate font-medium text-copy hover:text-accent">
                                       {fav.film_title || 'Unknown title'}
                                    </span>
                                 </MediaLink>
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4">
                                 <span className="rounded-full bg-primary-background-color px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-copy/80">
                                    {MEDIA_TYPE_LABELS[fav.media_type]}
                                 </span>
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4 tabular-nums">
                                 {extractYear(fav.film_release_date)}
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4 tabular-nums">
                                 {formatDate(fav.created_at)}
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4">
                                 <select
                                    aria-label={`Status for ${fav.film_title || 'Unknown title'}`}
                                    className={ROW_SELECT}
                                    value={fav.status}
                                    onChange={(e) =>
                                       setStatus(
                                          fav.film_id,
                                          fav.media_type,
                                          e.target.value as FavoriteStatus
                                       )
                                    }
                                 >
                                    {FAVORITE_STATUS_ORDER.map((status) => (
                                       <option key={status} value={status}>
                                          {FAVORITE_STATUS_LABELS[status]}
                                       </option>
                                    ))}
                                 </select>
                              </td>
                              <td className="py-2">
                                 <FavoriteButton
                                    filmId={fav.film_id}
                                    mediaType={fav.media_type}
                                    filmTitle={fav.film_title}
                                    filmPosterPath={fav.film_poster_path}
                                    filmReleaseDate={fav.film_release_date}
                                 />
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </Container>
   );
};

export default FavoritesView;
