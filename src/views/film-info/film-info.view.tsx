import './film-info.styles.css';

import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import FilmCard from '@/components/atoms/film-card/film-card.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath, baseImagePathPoster } from '@/services/config';
import type {
   FilmCreditsType,
   FilmInfoType,
   FilmRecommendationType,
   FilmVideoType,
} from '@/types/films.types';

const CREW_JOBS = new Set(['Director', 'Screenplay', 'Writer']);
const CAST_LIMIT = 8;

const formatCurrency = (amount: number) =>
   amount > 0
      ? new Intl.NumberFormat('en-US', {
           style: 'currency',
           currency: 'USD',
           maximumFractionDigits: 0,
        }).format(amount)
      : 'N/A';

const FilmInfo = ({
   filmInfo,
   filmTrailer,
   filmCredits,
   recommendations,
}: {
   filmInfo: FilmInfoType;
   filmTrailer?: FilmVideoType;
   filmCredits?: FilmCreditsType;
   recommendations?: FilmRecommendationType[];
}) => {
   const directors =
      filmCredits?.crew.filter((c) => c.job === 'Director') ?? [];
   const writers =
      filmCredits?.crew.filter(
         (c) => CREW_JOBS.has(c.job) && c.job !== 'Director'
      ) ?? [];
   const topCast = filmCredits?.cast.slice(0, CAST_LIMIT) ?? [];

   return (
      <Container>
         <div className="text-title text-copy">
            <span data-testid="film-info-title">{filmInfo.title}</span>
         </div>
         <div
            className="container-bg"
            style={{
               backgroundImage: `url(${baseImagePathPoster + filmInfo.backdrop_path})`,
            }}
         >
            <div>
               <img
                  loading="lazy"
                  src={`${baseImagePath}${filmInfo.poster_path}`}
                  alt=""
               />
            </div>

            <div className="text-content rounded-lg p-4 text-copy">
               <h2 className="mb-3 text-3xl">
                  <strong>{filmInfo.title}</strong>
               </h2>
               {filmInfo.tagline && (
                  <h3 className="text-2xl">
                     <strong>{filmInfo.tagline}</strong>
                  </h3>
               )}

               <div className="my-3 flex justify-center">
                  <FavoriteButton
                     filmId={filmInfo.id}
                     filmTitle={filmInfo.title}
                     filmPosterPath={filmInfo.poster_path}
                     filmReleaseDate={filmInfo.release_date}
                  />
               </div>

               <hr className="my-3 border-bold" />

               {filmInfo.genres && filmInfo.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                     <span className="bg-primary rounded-full px-2 py-1 text-sm">
                        Genre:{' '}
                     </span>
                     {filmInfo.genres.map((genre) => (
                        <span
                           key={genre.id}
                           className="bg-primary rounded-full px-2 py-1 text-sm italic"
                        >
                           {genre.name}
                        </span>
                     ))}
                  </div>
               )}
               <hr className="my-3 border-bold" />

               <p>
                  <strong>Overview : </strong>
                  {filmInfo.overview}
               </p>

               <hr className="my-3 border-bold" />

               <div>
                  <strong>Rating : </strong>
                  {filmInfo.vote_average?.toFixed(1)} / 10
                  {filmInfo.vote_count !== undefined && (
                     <span className="ml-2 text-sm opacity-70">
                        ({filmInfo.vote_count.toLocaleString()} votes)
                     </span>
                  )}
               </div>
               <div>
                  <strong>Status : </strong>
                  {filmInfo.status ?? 'N/A'}
               </div>
               <div>
                  <strong>Release Date : </strong>
                  {filmInfo.release_date}
               </div>
               <div>
                  <strong>Duration : </strong>
                  {filmInfo.runtime ? `${filmInfo.runtime} minutes` : 'N/A'}
               </div>
               {filmInfo.original_language && (
                  <div>
                     <strong>Original Language : </strong>
                     {filmInfo.spoken_languages?.find(
                        (l) => l.iso_639_1 === filmInfo.original_language
                     )?.english_name ??
                        filmInfo.original_language.toUpperCase()}
                  </div>
               )}

               <hr className="my-3 border-bold" />

               {(filmInfo.budget !== undefined ||
                  filmInfo.revenue !== undefined) && (
                  <div className="my-2 mt-2 flex justify-center gap-6">
                     {filmInfo.budget !== undefined && (
                        <div>
                           <strong>Budget : </strong>
                           {formatCurrency(filmInfo.budget)}
                        </div>
                     )}
                     {filmInfo.revenue !== undefined && (
                        <div>
                           <strong>Revenue : </strong>
                           {formatCurrency(filmInfo.revenue)}
                        </div>
                     )}
                  </div>
               )}
               {filmInfo.production_companies &&
                  filmInfo.production_companies.length > 0 && (
                     <div className="mt-2">
                        <strong>Production : </strong>
                        {filmInfo.production_companies
                           .map((c) => c.name)
                           .join(', ')}
                     </div>
                  )}

               {(filmInfo.homepage || filmInfo.imdb_id) && (
                  <div className="mt-2 flex flex-wrap gap-4">
                     {filmInfo.homepage && (
                        <a
                           href={filmInfo.homepage}
                           target="_blank"
                           rel="noreferrer"
                           className="text-copy underline"
                        >
                           Homepage
                        </a>
                     )}
                     {filmInfo.imdb_id && (
                        <a
                           href={`https://www.imdb.com/title/${filmInfo.imdb_id}`}
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

            {filmTrailer && (
               <div className="mt-4 rounded-lg">
                  <iframe
                     className="m-auto rounded-lg"
                     id={filmInfo.title}
                     title={filmInfo.title}
                     width="100%"
                     height="800"
                     src={`https://www.youtube.com/embed/${filmTrailer.key}`}
                  />
               </div>
            )}

            {(directors.length > 0 ||
               writers.length > 0 ||
               topCast.length > 0) && (
               <div className="text-content mt-4 rounded-lg p-4 text-copy">
                  <h2 className="mb-3 text-2xl">
                     <strong>Cast &amp; Crew</strong>
                  </h2>

                  {directors.length > 0 && (
                     <div className="mb-1">
                        <strong>
                           Director{directors.length > 1 ? 's' : ''}:{' '}
                        </strong>
                        {directors.map((d) => d.name).join(', ')}
                     </div>
                  )}
                  {writers.length > 0 && (
                     <div className="mb-3">
                        <strong>Writers: </strong>
                        {writers.map((w) => w.name).join(', ')}
                     </div>
                  )}

                  {topCast.length > 0 && (
                     <div className="flex flex-wrap justify-center gap-4">
                        {topCast.map((member) => (
                           <div
                              key={`${member.id}-${member.character}`}
                              className="flex w-20 flex-col items-center gap-1 text-center"
                           >
                              {member.profile_path ? (
                                 <img
                                    loading="lazy"
                                    src={`${baseImagePath}${member.profile_path}`}
                                    alt={member.name}
                                    className="h-16 w-16 rounded-full object-cover object-top"
                                 />
                              ) : (
                                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400 text-2xl text-white">
                                    👤
                                 </div>
                              )}
                              <span className="text-xs font-semibold leading-tight">
                                 {member.name}
                              </span>
                              <span className="text-xs leading-tight opacity-70">
                                 {member.character}
                              </span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {recommendations && recommendations.length > 0 && (
               <div className="text-content mt-4 rounded-lg p-4 text-copy">
                  <h2 className="mb-4 text-2xl">
                     <strong>Recommendations</strong>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4">
                     {recommendations.map((film) => (
                        <FilmCard
                           key={film.id}
                           id={film.id}
                           title={film.title}
                           poster_path={film.poster_path}
                           release_date={film.release_date}
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

export default FilmInfo;
