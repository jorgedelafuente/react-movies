import '@/views/film-info/film-info.styles.css';

import { Link } from '@tanstack/react-router';

import MediaImage from '@/components/atoms/media-image/media-image.component';
import Container from '@/components/layout/container/container.component';
import type { SeasonDetailType, SeriesInfoType } from '@/types/series.types';

const extractYear = (dateStr: string | null | undefined) =>
   dateStr && /^\d{4}/.test(dateStr) ? dateStr.slice(0, 4) : '—';

const formatDate = (iso: string | null) => {
   if (!iso) return 'TBA';
   const d = new Date(iso);
   return isNaN(d.getTime())
      ? 'TBA'
      : d.toLocaleDateString('en-GB', {
           day: '2-digit',
           month: 'short',
           year: 'numeric',
        });
};

const SeasonInfo = ({
   seriesInfo,
   season,
}: {
   seriesInfo: SeriesInfoType;
   season: SeasonDetailType;
}) => {
   const otherSeasons = seriesInfo.seasons ?? [];
   const episodes = season.episodes;

   return (
      <Container>
         <div className="text-title text-copy">
            <span data-testid="season-info-title">
               {seriesInfo.name} · {season.name}
            </span>
         </div>

         <div className="mx-auto w-full max-w-4xl px-4 py-6 text-copy">
            <Link
               to="/tv/$seriesId"
               params={{ seriesId: String(seriesInfo.id) }}
               className="text-sm text-accent hover:underline"
            >
               ← {seriesInfo.name}
            </Link>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row">
               <MediaImage
                  path={season.poster_path}
                  alt=""
                  className="mx-auto w-40 flex-none rounded-lg sm:mx-0"
                  fallbackClassName="aspect-[2/3]"
               />
               <div className="min-w-0 flex-1">
                  <h1 className="text-display-lg">{season.name}</h1>
                  <p className="mt-1 text-sm tabular-nums text-copy/70">
                     {extractYear(season.air_date)}
                     <span className="mx-1 opacity-50">·</span>
                     {episodes.length} episode{episodes.length === 1 ? '' : 's'}
                     {season.vote_average ? (
                        <>
                           <span className="mx-1 opacity-50">·</span>
                           {season.vote_average.toFixed(1)} / 10
                        </>
                     ) : null}
                  </p>
                  {season.overview && (
                     <p className="mt-3 leading-relaxed">{season.overview}</p>
                  )}
               </div>
            </div>

            {otherSeasons.length > 1 && (
               <nav aria-label="Seasons" className="mt-6 flex flex-wrap gap-2">
                  {otherSeasons.map((s) => {
                     const current = s.season_number === season.season_number;
                     return (
                        <Link
                           key={s.id}
                           to="/tv/$seriesId/season/$seasonNumber"
                           params={{
                              seriesId: String(seriesInfo.id),
                              seasonNumber: String(s.season_number),
                           }}
                           aria-current={current ? 'page' : undefined}
                           className={`rounded-full border px-3 py-1 text-sm ${
                              current
                                 ? 'border-accent bg-accent/10 text-accent'
                                 : 'border-copy/30 hover:border-accent hover:text-accent'
                           }`}
                        >
                           {s.name}
                        </Link>
                     );
                  })}
               </nav>
            )}

            <h2 className="mt-8 text-display-md">Episodes</h2>
            {episodes.length === 0 ? (
               <p className="mt-2 opacity-70">No episodes listed yet.</p>
            ) : (
               <ol className="mt-3 flex flex-col gap-4">
                  {episodes.map((ep) => (
                     <li
                        key={ep.id}
                        className="flex flex-col gap-3 rounded-lg bg-tertiary-background-color p-3 sm:flex-row"
                     >
                        <MediaImage
                           path={ep.still_path}
                           alt=""
                           className="aspect-video w-full flex-none rounded-md object-cover sm:w-56"
                        />
                        <div className="min-w-0 flex-1">
                           <h3 className="font-display text-base font-semibold leading-tight">
                              <span className="mr-2 tabular-nums opacity-60">
                                 {ep.episode_number}.
                              </span>
                              {ep.name}
                           </h3>
                           <p className="mt-1 text-xs tabular-nums text-copy/70">
                              {formatDate(ep.air_date)}
                              {ep.runtime ? (
                                 <>
                                    <span className="mx-1 opacity-50">·</span>
                                    {ep.runtime} min
                                 </>
                              ) : null}
                              {ep.vote_average && ep.vote_count ? (
                                 <>
                                    <span className="mx-1 opacity-50">·</span>
                                    <span
                                       title={`${ep.vote_count} votes`}
                                       data-testid="episode-rating"
                                    >
                                       ★ {ep.vote_average.toFixed(1)}
                                    </span>
                                 </>
                              ) : null}
                           </p>
                           {ep.overview && (
                              <p className="mt-2 text-sm leading-relaxed">
                                 {ep.overview}
                              </p>
                           )}
                        </div>
                     </li>
                  ))}
               </ol>
            )}
         </div>
      </Container>
   );
};

export default SeasonInfo;
