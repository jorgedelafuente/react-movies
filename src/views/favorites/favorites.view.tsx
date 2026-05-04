import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath } from '@/services/config';
import type { FavoriteRow } from '@/services/supabase/favorites';
import { useFavorites } from '@/utils/hooks/useFavorites';

type SortKey = 'created_at' | 'film_release_date';
type SortDir = 'asc' | 'desc';

const formatDate = (iso: string) => {
   if (!iso) return '—';
   const d = new Date(iso);
   return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const extractYear = (dateStr: string) => {
   if (!dateStr) return '—';
   const year = dateStr.slice(0, 4);
   return /^\d{4}$/.test(year) ? year : '—';
};

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
   <span className="ml-1 inline-block text-xs opacity-60">
      {active ? (dir === 'asc' ? '▲' : '▼') : '⇅'}
   </span>
);

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
            <h1 className="mb-6 text-left text-2xl font-bold text-copy">My Favorites</h1>

            {isLoading && (
               <p className="text-copy opacity-60">Loading…</p>
            )}

            {!isLoading && favorites.length === 0 && (
               <div className="text-left text-copy">
                  <p className="mb-3">You haven't saved any favorites yet. Browse films and tap the heart icon to add them to your list.</p>
                  <Link to="/" className="text-sky-500 hover:underline">
                     Browse films
                  </Link>
               </div>
            )}

            {!isLoading && favorites.length > 0 && (
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-copy">
                     <thead>
                        <tr className="border-b border-bold">
                           <th className="py-2 pr-4 font-semibold">Poster</th>
                           <th className="py-2 pr-4 font-semibold">Title</th>
                           <th
                              className="cursor-pointer whitespace-nowrap py-2 pr-4 font-semibold hover:text-sky-500"
                              onClick={() => handleSort('film_release_date')}
                           >
                              Year
                              <SortIcon active={sortKey === 'film_release_date'} dir={sortDir} />
                           </th>
                           <th
                              className="cursor-pointer whitespace-nowrap py-2 pr-4 font-semibold hover:text-sky-500"
                              onClick={() => handleSort('created_at')}
                           >
                              Added
                              <SortIcon active={sortKey === 'created_at'} dir={sortDir} />
                           </th>
                           <th className="py-2 font-semibold">Remove</th>
                        </tr>
                     </thead>
                     <tbody>
                        {sorted.map((fav) => (
                           <tr key={fav.id} className="border-b border-bold/30 hover:bg-neutral-inverted/5">
                              <td className="py-2 pr-4">
                                 {fav.film_poster_path ? (
                                    <img
                                       src={`${baseImagePath}${fav.film_poster_path}`}
                                       alt={fav.film_title || 'Film poster'}
                                       className="h-16 w-10 rounded object-cover"
                                    />
                                 ) : (
                                    <div className="h-16 w-10 rounded bg-copy/10" />
                                 )}
                              </td>
                              <td className="max-w-xs py-2 pr-4">
                                 <Link
                                    to="/film/$filmId"
                                    params={{ filmId: String(fav.film_id) }}
                                 >
                                    <span className="truncate block text-copy hover:text-sky-500">
                                       {fav.film_title || 'Unknown title'}
                                    </span>
                                 </Link>
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4">
                                 {extractYear(fav.film_release_date)}
                              </td>
                              <td className="whitespace-nowrap py-2 pr-4">
                                 {formatDate(fav.created_at)}
                              </td>
                              <td className="py-2">
                                 <FavoriteButton
                                    filmId={fav.film_id}
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
