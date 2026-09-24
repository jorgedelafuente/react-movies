import '@/views/film-info/film-info.styles.css';

import { Link } from '@tanstack/react-router';

import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import FilmCard from '@/components/atoms/film-card/film-card.component';
import CastList from '@/components/cast-list/cast-list.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath, baseImagePathPoster } from '@/services/config';
import type {
   FilmCreditsType,
   FilmRecommendationType,
   FilmVideoType,
} from '@/types/films.types';
import { MEDIA_TYPES } from '@/types/media.types';
import type { SeriesInfoType } from '@/types/series.types';

const CAST_LIMIT = 8;

const formatRuntime = (runtimes?: number[]) =>
   runtimes && runtimes.length > 0
      ? `${[...new Set(runtimes)].join(' / ')} minutes`
      : 'N/A';

const extractYear = (dateStr: string | null | undefined) =>
   dateStr && /^\d{4}/.test(dateStr) ? dateStr.slice(0, 4) : '—';

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
   const topCast = seriesCredits?.cast.slice(0, CAST_LIMIT) ?? [];
   const seasons = seriesInfo.seasons ?? [];
   const imdbId = seriesInfo.external_ids?.imdb_id;

   return (
      <Container>
         <div className="text-title text-copy">
            <span data-testid="series-info-title">{seriesInfo.name}</span>
         </div>
         <div
            className="container-bg"
            style={{
               backgroundImage: `url(${baseImagePathPoster + seriesInfo.backdrop_path})`,
            }}
         >
            <div>
               <img
                  loading="lazy"
                  src={`${baseImagePath}${seriesInfo.poster_path}`}
                  alt=""
               />
            </div>

            <div className="text-content rounded-lg p-4 text-copy">
               <h2 className="mb-2 text-display-lg">{seriesInfo.name}</h2>
               {seriesInfo.tagline && (
                  <h3 className="font-sans text-lg font-normal italic tracking-normal text-copy/75 sm:text-xl">
                     {seriesInfo.tagline}
                  </h3>
               )}

               <div className="my-3 flex justify-center">
                  <FavoriteButton
                     filmId={seriesInfo.id}
                     mediaType={MEDIA_TYPES.TV}
                     filmTitle={seriesInfo.name}
                     filmPosterPath={seriesInfo.poster_path}
                     filmReleaseDate={seriesInfo.first_air_date ?? ''}
                  />
               </div>

               <hr className="my-3 border-bold" />

               {seriesInfo.genres && seriesInfo.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                     <span className="bg-primary rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-copy/70">
                        Genre
                     </span>
                     {seriesInfo.genres.map((genre) => (
                        <span
                           key={genre.id}
                           className="bg-primary rounded-full px-2 py-1 text-sm font-medium"
                        >
                           {genre.name}
                        </span>
                     ))}
                  </div>
               )}
               <hr className="my-3 border-bold" />

               <p className="leading-relaxed">
                  <strong>Overview: </strong>
                  {seriesInfo.overview}
               </p>

               <hr className="my-3 border-bold" />

               <div className="tabular-nums">
                  <strong>Rating: </strong>
                  {seriesInfo.vote_average?.toFixed(1)} / 10
                  {seriesInfo.vote_count !== undefined && (
                     <span className="ml-2 text-sm opacity-70">
                        ({seriesInfo.vote_count.toLocaleString()} votes)
                     </span>
                  )}
               </div>
               <div>
                  <strong>Status: </strong>
                  {seriesInfo.status ?? 'N/A'}
                  {seriesInfo.in_production && (
                     <span className="ml-2 text-sm opacity-70">
                        (in production)
                     </span>
                  )}
               </div>
               {seriesInfo.type && (
                  <div>
                     <strong>Type: </strong>
                     {seriesInfo.type}
                  </div>
               )}
               <div className="tabular-nums">
                  <strong>First Aired: </strong>
                  {seriesInfo.first_air_date || 'N/A'}
               </div>
               {seriesInfo.last_air_date && (
                  <div className="tabular-nums">
                     <strong>Last Aired: </strong>
                     {seriesInfo.last_air_date}
                  </div>
               )}
               <div className="tabular-nums">
                  <strong>Seasons: </strong>
                  {seriesInfo.number_of_seasons ?? 'N/A'}
                  <span className="mx-2 opacity-50">·</span>
                  <strong>Episodes: </strong>
                  {seriesInfo.number_of_episodes ?? 'N/A'}
               </div>
               <div className="tabular-nums">
                  <strong>Episode Length: </strong>
                  {formatRuntime(seriesInfo.episode_run_time)}
               </div>
               {seriesInfo.original_language && (
                  <div>
                     <strong>Original Language: </strong>
                     {seriesInfo.spoken_languages?.find(
                        (l) => l.iso_639_1 === seriesInfo.original_language
                     )?.english_name ??
                        seriesInfo.original_language.toUpperCase()}
                  </div>
               )}

               <hr className="my-3 border-bold" />

               {creators.length > 0 && (
                  <div className="mt-2">
                     <strong>Created by: </strong>
                     {creators.map((c) => c.name).join(', ')}
                  </div>
               )}
               {seriesInfo.networks && seriesInfo.networks.length > 0 && (
                  <div className="mt-2">
                     <strong>Network: </strong>
                     {seriesInfo.networks.map((n) => n.name).join(', ')}
                  </div>
               )}
               {seriesInfo.production_companies &&
                  seriesInfo.production_companies.length > 0 && (
                     <div className="mt-2">
                        <strong>Production: </strong>
                        {seriesInfo.production_companies
                           .map((c) => c.name)
                           .join(', ')}
                     </div>
                  )}

               {(seriesInfo.homepage || imdbId) && (
                  <div className="mt-2 flex flex-wrap gap-4">
                     {seriesInfo.homepage && (
                        <a
                           href={seriesInfo.homepage}
                           target="_blank"
                           rel="noreferrer"
                           className="text-copy underline"
                        >
                           Homepage
                        </a>
                     )}
                     {imdbId && (
                        <a
                           href={`https://www.imdb.com/title/${imdbId}`}
                           target="_blank"
                           rel="noreferrer"
                           className="text-copy underline"
                        >
                           IMDB
                        </a>
                     )}
                  </div>
               )}
            </div>

            {seriesTrailer && (
               <div className="mt-4 rounded-lg">
                  <iframe
                     className="m-auto rounded-lg"
                     id={seriesInfo.name}
                     title={seriesInfo.name}
                     width="100%"
                     height="800"
                     src={`https://www.youtube.com/embed/${seriesTrailer.key}`}
                  />
               </div>
            )}

            {seasons.length > 0 && (
               <div className="text-content mt-4 rounded-lg p-4 text-copy">
                  <h2 className="mb-3 text-display-md">Seasons</h2>
                  <ul className="flex flex-col gap-3">
                     {seasons.map((season) => (
                        <li key={season.id}>
                           <Link
                              to="/tv/$seriesId/season/$seasonNumber"
                              params={{
                                 seriesId: String(seriesInfo.id),
                                 seasonNumber: String(season.season_number),
                              }}
                              className="bg-primary-background-color/40 hover:bg-primary-background-color/70 flex items-center gap-3 rounded-md p-2 text-inherit hover:text-accent"
                           >
                              {season.poster_path ? (
                                 <img
                                    loading="lazy"
                                    src={`${baseImagePath}${season.poster_path}`}
                                    alt=""
                                    className="h-16 w-11 flex-none rounded object-cover"
                                 />
                              ) : (
                                 <div className="h-16 w-11 flex-none rounded bg-gray-400/40" />
                              )}
                              <div className="min-w-0 flex-1">
                                 <div className="font-display text-sm font-semibold leading-tight">
                                    {season.name}
                                 </div>
                                 <div className="text-xs tabular-nums text-copy/70">
                                    {extractYear(season.air_date)}
                                    <span className="mx-1 opacity-50">·</span>
                                    {season.episode_count} episode
                                    {season.episode_count === 1 ? '' : 's'}
                                 </div>
                              </div>
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {topCast.length > 0 && (
               <div className="text-content mt-4 rounded-lg p-4 text-copy">
                  <h2 className="mb-3 text-display-md">Cast</h2>
                  <CastList cast={topCast} />
               </div>
            )}

            {recommendations && recommendations.length > 0 && (
               <div className="text-content mt-4 rounded-lg p-4 text-copy">
                  <h2 className="mb-4 text-display-md">Recommendations</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
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
                  </div>
               </div>
            )}
         </div>
      </Container>
   );
};

export default SeriesInfo;
