import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import MediaLink from '@/components/atoms/link/media-link.component';
import SortableHeader from '@/components/atoms/sortable-header/sortable-header.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath } from '@/services/config';
import type { FavoriteRow } from '@/services/supabase/favorites';
import { MEDIA_TYPE_LABELS } from '@/types/media.types';
import { useFavorites } from '@/utils/hooks/useFavorites';

type SortKey = 'created_at' | 'film_release_date' | 'media_type';
type SortDir = 'asc' | 'desc';

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
   const { favorites, isLoading } = useFavorites();
   const [sortKey, setSortKey] = useState<SortKey>('created_at');
   const [sortDir, setSortDir] = useState<SortDir>('desc');

   const handleSort = (key: SortKey) => {
      if (sortKey === key) {
         setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
         setSortKey(key);
         setSortDir('desc');
      }
   };

   const sorted = [...favorites].sort((a: FavoriteRow, b: FavoriteRow) => {
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
                     <Link to="/" className="text-accent hover:underline">
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
                                 {fav.film_poster_path ? (
                                    <img
                                       src={`${baseImagePath}${fav.film_poster_path}`}
                                       alt={fav.film_title || 'Poster'}
                                       className="h-16 w-10 rounded object-cover"
                                    />
                                 ) : (
                                    <div className="bg-copy/10 h-16 w-10 rounded" />
                                 )}
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
