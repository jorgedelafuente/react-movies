import './film-info.styles.css';

import FavoriteButton from '@/components/atoms/favorite-button/favorite-button.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath, baseImagePathPoster } from '@/services/config';
import type { FilmInfoType, FilmVideoType } from '@/types/films.types';

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
}: {
   filmInfo: FilmInfoType;
   filmTrailer?: FilmVideoType;
}) => {
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

               <div className="flex justify-center my-3">
                  <FavoriteButton filmId={filmInfo.id} />
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
               {filmInfo.homepage && (
                  <div>
                     <strong>Homepage : </strong>
                     <a
                        href={filmInfo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-copy underline"
                     >
                        {filmInfo.homepage}
                     </a>
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
         </div>
      </Container>
   );
};

export default FilmInfo;
