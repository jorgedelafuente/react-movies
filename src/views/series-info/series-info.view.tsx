import '@/views/film-info/film-info.styles.css';

import { Link } from '@tanstack/react-router';

import CardGrid from '@/components/atoms/card-grid/card-grid.component';
import { ExternalLink } from '@/components/atoms/link/external-link.component';
import MediaImage from '@/components/atoms/media-image/media-image.component';
import ScoreRing from '@/components/atoms/score-ring/score-ring.component';
import {
   EYEBROW,
   Stat,
   StatNote,
} from '@/components/atoms/stat/stat.component';
import StickyTitle from '@/components/atoms/sticky-title/sticky-title.component';
import CastList from '@/components/cast-list/cast-list.component';
import FavoriteButton, {
   FAVORITE_ROUND,
} from '@/components/favorite-button/favorite-button.component';
import FilmCard from '@/components/film-card/film-card.component';
import ImageGallery from '@/components/image-gallery/image-gallery.component';
import Container from '@/components/layout/container/container.component';
import ReviewList from '@/components/review-list/review-list.component';
import { baseImagePathPoster } from '@/services/config';
import type {
   FilmCreditsType,
   FilmRecommendationType,
   FilmVideoType,
} from '@/types/films.schemas';
import { MEDIA_TYPES } from '@/types/media.types';
import type { SeriesInfoType } from '@/types/series.schemas';
import { formatRuntime } from '@/utils/formatRuntime';
import { formatReleaseDate } from '@/utils/releaseDates';

const CAST_LIMIT = 8;

/** Distinct episode lengths, e.g. `45m / 1h`. */
const formatEpisodeLength = (runtimes: number[]) =>
   [...new Set(runtimes.filter((minutes) => minutes > 0))]
      .map(formatRuntime)
      .join(' / ');

const extractYear = (dateStr: string | null | undefined) =>
   dateStr && /^\d{4}/.test(dateStr) ? dateStr.slice(0, 4) : '—';

/** `2011–2019`, or just `2011` when the run is a single year or still open. */
const yearRange = (first: string | null, last: string | null | undefined) => {
   const from = extractYear(first);
   if (from === '—') return null;
   const to = extractYear(last);
   return to !== '—' && to !== from ? `${from}–${to}` : from;
};

const pluralise = (count: number, noun: string) =>
   `${count.toLocaleString()} ${noun}${count === 1 ? '' : 's'}`;

const SeriesInfo = ({
   seriesInfo,
   seriesTrailer,
   seriesCredits,
   recommendations,
}: {
   seriesInfo: SeriesInfoType;
   seriesTrailer?: FilmVideoType;
   seriesCredits?: FilmCreditsType;
   recommendations?: FilmRecommendationType[];
}) => {
   const creators = seriesInfo.created_by ?? [];
   const networks = seriesInfo.networks ?? [];
   const topCast = seriesCredits?.cast.slice(0, CAST_LIMIT) ?? [];
   const seasons = seriesInfo.seasons ?? [];
   const imdbId = seriesInfo.external_ids?.imdb_id;

   const meta = [
      yearRange(seriesInfo.first_air_date, seriesInfo.last_air_date),
      seriesInfo.number_of_seasons !== undefined
         ? pluralise(seriesInfo.number_of_seasons, 'season')
         : null,
      seriesInfo.number_of_episodes !== undefined
         ? pluralise(seriesInfo.number_of_episodes, 'episode')
         : null,
   ].filter((item): item is string => item !== null);
   const episodeLength = seriesInfo.episode_run_time
      ? formatEpisodeLength(seriesInfo.episode_run_time)
      : '';
   const language = seriesInfo.original_language
      ? (seriesInfo.spoken_languages?.find(
           (l) => l.iso_639_1 === seriesInfo.original_language
        )?.english_name ?? seriesInfo.original_language.toUpperCase())
      : undefined;

   return (
      <Container>
         <StickyTitle testId="series-info-title">{seriesInfo.name}</StickyTitle>
         <div
            className="container-bg"
            style={{
               backgroundImage: `url(${baseImagePathPoster + seriesInfo.backdrop_path})`,
            }}
         >
            <div>
               <MediaImage
                  path={seriesInfo.poster_path}
                  alt=""
                  className="mx-auto rounded-[25px] shadow-2xl"
                  fallbackClassName="aspect-[2/3] w-full max-w-[500px]"
               />
            </div>

            <div className="text-content mt-4 gap-6 rounded-lg p-5 text-copy sm:p-8">
               <header className="flex flex-col items-center gap-2">
                  <h2 className="text-display-lg">{seriesInfo.name}</h2>
                  {seriesInfo.tagline && (
                     <p className="font-sans text-lg italic text-copy/70 sm:text-xl">
                        {seriesInfo.tagline}
                     </p>
                  )}
                  {meta.length > 0 && (
                     <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium tabular-nums text-copy/80">
                        {meta.map((item, index) => (
                           <span
                              key={item}
                              className="flex items-center gap-x-3"
                           >
                              {index > 0 && <span aria-hidden="true">·</span>}
                              {item}
                           </span>
                        ))}
                     </div>
                  )}
               </header>

               {/* FavoriteButton renders nothing when signed out, so the row is just the ring. */}
               <div className="flex flex-wrap items-center justify-center gap-6">
                  <ScoreRing
                     score={seriesInfo.vote_average}
                     votes={seriesInfo.vote_count}
                  />
                  <FavoriteButton
                     filmId={seriesInfo.id}
                     mediaType={MEDIA_TYPES.TV}
                     filmTitle={seriesInfo.name}
                     filmPosterPath={seriesInfo.poster_path}
                     filmReleaseDate={seriesInfo.first_air_date ?? ''}
                     className={FAVORITE_ROUND}
                  />
               </div>

               {seriesInfo.genres && seriesInfo.genres.length > 0 && (
                  <ul
                     aria-label="Genres"
                     className="flex flex-wrap items-center justify-center gap-2"
                  >
                     {seriesInfo.genres.map((genre) => (
                        <li
                           key={genre.id}
                           className="rounded-full border border-copy/15 bg-neutral-inverted/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                        >
                           {genre.name}
                        </li>
                     ))}
                  </ul>
               )}

               {seriesInfo.overview && (
                  <section className="mx-auto flex w-full max-w-prose flex-col gap-2 text-left">
                     <h3 className={`font-sans ${EYEBROW}`}>Overview</h3>
                     <p className="text-pretty leading-relaxed sm:text-lg">
                        {seriesInfo.overview}
                     </p>
                  </section>
               )}

               {/* Two columns on phones (an odd last cell spans both so it centres); from `sm` a centred strip that wraps evenly whatever the count. */}
               <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-copy/10 py-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 [&>:last-child:nth-child(odd)]:col-span-2">
                  <Stat label="Status">
                     {seriesInfo.status ?? 'N/A'}
                     {seriesInfo.in_production && (
                        <StatNote>In production</StatNote>
                     )}
                  </Stat>
                  {seriesInfo.type && (
                     <Stat label="Type">{seriesInfo.type}</Stat>
                  )}
                  <Stat label="First aired">
                     {seriesInfo.first_air_date
                        ? formatReleaseDate(seriesInfo.first_air_date)
                        : 'N/A'}
                  </Stat>
                  {seriesInfo.last_air_date && (
                     <Stat label="Last aired">
                        {formatReleaseDate(seriesInfo.last_air_date)}
                     </Stat>
                  )}
                  {episodeLength && (
                     <Stat label="Episode length">{episodeLength}</Stat>
                  )}
                  {language && <Stat label="Language">{language}</Stat>}
               </dl>

               {(creators.length > 0 || networks.length > 0) && (
                  <dl className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                     {creators.length > 0 && (
                        <Stat label="Created by">
                           {creators.map((c) => c.name).join(', ')}
                        </Stat>
                     )}
                     {networks.length > 0 && (
                        <Stat
                           label={networks.length > 1 ? 'Networks' : 'Network'}
                        >
                           {networks.map((n) => n.name).join(', ')}
                        </Stat>
                     )}
                  </dl>
               )}

               {seriesInfo.production_companies &&
                  seriesInfo.production_companies.length > 0 && (
                     <div className="flex flex-col items-center gap-1">
                        <span className={EYEBROW}>Production</span>
                        <p className="text-sm text-copy/80">
                           {seriesInfo.production_companies
                              .map((c) => c.name)
                              .join(' · ')}
                        </p>
                     </div>
                  )}

               {(seriesInfo.homepage || imdbId) && (
                  <div className="flex flex-wrap justify-center gap-3">
                     {seriesInfo.homepage && (
                        <ExternalLink href={seriesInfo.homepage}>
                           Homepage
                        </ExternalLink>
                     )}
                     {imdbId && (
                        <ExternalLink
                           href={`https://www.imdb.com/title/${imdbId}`}
                        >
                           IMDb
                        </ExternalLink>
                     )}
                  </div>
               )}
            </div>

            {seriesTrailer && (
               <div className="hero-trailer mt-4 overflow-hidden rounded-lg shadow-lg">
                  <iframe
                     className="h-full w-full"
                     title={`${seriesInfo.name} trailer`}
                     src={`https://www.youtube.com/embed/${seriesTrailer.key}`}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                  />
               </div>
            )}

            {seasons.length > 0 && (
               <div className="text-content mt-4 gap-4 rounded-lg p-5 text-copy sm:p-8">
                  <h2 className="text-display-md">Seasons</h2>
                  <ul className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                     {seasons.map((season) => (
                        <li key={season.id} className="min-w-0">
                           <Link
                              to="/tv/$seriesId/season/$seasonNumber"
                              params={{
                                 seriesId: String(seriesInfo.id),
                                 seasonNumber: String(season.season_number),
                              }}
                              className="group flex flex-col gap-2 rounded-lg text-center text-inherit hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                           >
                              <div className="overflow-hidden rounded-lg">
                                 <MediaImage
                                    path={season.poster_path}
                                    alt=""
                                    className="aspect-[2/3] w-full object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
                                 />
                              </div>
                              {/* Fixed-height caption so rows stay aligned whatever the text length. */}
                              <div className="flex h-11 flex-col gap-0.5">
                                 <span className="truncate font-display text-sm font-semibold leading-tight">
                                    {season.name}
                                 </span>
                                 <span className="truncate text-xs tabular-nums text-copy/70">
                                    {extractYear(season.air_date)}
                                    <span className="mx-1 opacity-50">·</span>
                                    {pluralise(season.episode_count, 'episode')}
                                 </span>
                              </div>
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {topCast.length > 0 && (
               <div className="text-content mt-4 gap-5 rounded-lg p-5 text-copy sm:p-8">
                  <h2 className="text-display-md">Cast</h2>
                  <CastList cast={topCast} />
               </div>
            )}

            <ReviewList mediaType={MEDIA_TYPES.TV} id={seriesInfo.id} />

            <ImageGallery
               mediaType={MEDIA_TYPES.TV}
               id={seriesInfo.id}
               title={seriesInfo.name}
            />

            {recommendations && recommendations.length > 0 && (
               <div className="text-content mt-4 gap-4 rounded-lg p-5 text-copy sm:p-8">
                  <h2 className="text-display-md">Recommendations</h2>
                  <CardGrid>
                     {recommendations.map((series) => (
                        <FilmCard
                           key={series.id}
                           id={series.id}
                           media_type={series.media_type}
                           title={series.title}
                           poster_path={series.poster_path}
                           release_date={series.release_date}
                           showFavorite={false}
                        />
                     ))}
                  </CardGrid>
               </div>
            )}
         </div>
      </Container>
   );
};

export default SeriesInfo;
