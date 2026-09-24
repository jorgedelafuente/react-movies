import './film-info.styles.css';

import CardGrid from '@/components/atoms/card-grid/card-grid.component';
import { ExternalLink } from '@/components/atoms/link/external-link.component';
import MediaImage from '@/components/atoms/media-image/media-image.component';
import ScoreRing from '@/components/atoms/score-ring/score-ring.component';
import { EYEBROW, Stat } from '@/components/atoms/stat/stat.component';
import StickyTitle from '@/components/atoms/sticky-title/sticky-title.component';
import CastList from '@/components/cast-list/cast-list.component';
import FavoriteButton, {
   FAVORITE_ROUND,
} from '@/components/favorite-button/favorite-button.component';
import FilmCard from '@/components/film-card/film-card.component';
import ImageGallery from '@/components/image-gallery/image-gallery.component';
import Container from '@/components/layout/container/container.component';
import {
   CertificationBadge,
   ReleaseDatesList,
} from '@/components/release-dates/release-dates.component';
import ReviewList from '@/components/review-list/review-list.component';
import { baseImagePathPoster } from '@/services/config';
import type {
   FilmCreditsType,
   FilmInfoType,
   FilmRecommendationType,
   FilmVideoType,
} from '@/types/films.schemas';
import { MEDIA_TYPES } from '@/types/media.types';
import { formatRuntime } from '@/utils/formatRuntime';
import { formatReleaseDate } from '@/utils/releaseDates';

const CREW_JOBS = new Set(['Director', 'Screenplay', 'Writer']);
const CAST_LIMIT = 8;

const formatCurrency = (amount: number) =>
   new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
   }).format(amount);

const extractYear = (dateStr: string) => dateStr.slice(0, 4) || undefined;

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
   // The same person is often credited as both Screenplay and Writer.
   const writers = [
      ...new Set(
         filmCredits?.crew
            .filter((c) => CREW_JOBS.has(c.job) && c.job !== 'Director')
            .map((c) => c.name) ?? []
      ),
   ];
   const topCast = filmCredits?.cast.slice(0, CAST_LIMIT) ?? [];

   const year = extractYear(filmInfo.release_date);
   const runtime = filmInfo.runtime ? formatRuntime(filmInfo.runtime) : null;
   const meta = [year, runtime].filter(Boolean);
   const language = filmInfo.original_language
      ? (filmInfo.spoken_languages?.find(
           (l) => l.iso_639_1 === filmInfo.original_language
        )?.english_name ?? filmInfo.original_language.toUpperCase())
      : undefined;

   return (
      <Container>
         <StickyTitle testId="film-info-title">{filmInfo.title}</StickyTitle>
         <div
            className="container-bg"
            style={{
               backgroundImage: `url(${baseImagePathPoster + filmInfo.backdrop_path})`,
            }}
         >
            <div>
               <MediaImage
                  path={filmInfo.poster_path}
                  alt=""
                  className="mx-auto rounded-[25px] shadow-2xl"
                  fallbackClassName="aspect-[2/3] w-full max-w-[500px]"
               />
            </div>

            <div className="text-content mt-4 gap-6 rounded-lg p-5 text-copy sm:p-8">
               <header className="flex flex-col items-center gap-2">
                  <h2 className="text-display-lg">{filmInfo.title}</h2>
                  {filmInfo.tagline && (
                     <p className="font-sans text-lg italic text-copy/70 sm:text-xl">
                        {filmInfo.tagline}
                     </p>
                  )}
                  {(meta.length > 0 || filmInfo.release_dates) && (
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
                        <CertificationBadge
                           results={filmInfo.release_dates?.results}
                        />
                     </div>
                  )}
               </header>

               {/* FavoriteButton renders nothing when signed out, so the row is just the ring. */}
               <div className="flex flex-wrap items-center justify-center gap-6">
                  <ScoreRing
                     score={filmInfo.vote_average}
                     votes={filmInfo.vote_count}
                  />
                  <FavoriteButton
                     filmId={filmInfo.id}
                     filmTitle={filmInfo.title}
                     filmPosterPath={filmInfo.poster_path}
                     filmReleaseDate={filmInfo.release_date}
                     className={FAVORITE_ROUND}
                  />
               </div>

               {filmInfo.genres && filmInfo.genres.length > 0 && (
                  <ul
                     aria-label="Genres"
                     className="flex flex-wrap items-center justify-center gap-2"
                  >
                     {filmInfo.genres.map((genre) => (
                        <li
                           key={genre.id}
                           className="rounded-full border border-copy/15 bg-neutral-inverted/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                        >
                           {genre.name}
                        </li>
                     ))}
                  </ul>
               )}

               {filmInfo.overview && (
                  <section className="mx-auto flex w-full max-w-prose flex-col gap-2 text-left">
                     <h3 className={`font-sans ${EYEBROW}`}>Overview</h3>
                     <p className="text-pretty leading-relaxed sm:text-lg">
                        {filmInfo.overview}
                     </p>
                  </section>
               )}

               {/* Two columns on phones (an odd last cell spans both so it centres); from `sm` a centred strip that wraps evenly whatever the count. */}
               <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-copy/10 py-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 [&>:last-child:nth-child(odd)]:col-span-2">
                  <Stat label="Status">{filmInfo.status ?? 'N/A'}</Stat>
                  <Stat label="Released">
                     {filmInfo.release_date
                        ? formatReleaseDate(filmInfo.release_date)
                        : 'N/A'}
                  </Stat>
                  {language && <Stat label="Language">{language}</Stat>}
                  {/* TMDB reports 0 for unknown money; a row of N/A would only be noise. */}
                  {filmInfo.budget ? (
                     <Stat label="Budget">
                        {formatCurrency(filmInfo.budget)}
                     </Stat>
                  ) : null}
                  {filmInfo.revenue ? (
                     <Stat label="Revenue">
                        {formatCurrency(filmInfo.revenue)}
                     </Stat>
                  ) : null}
               </dl>

               {filmInfo.production_companies &&
                  filmInfo.production_companies.length > 0 && (
                     <div className="flex flex-col items-center gap-1">
                        <span className={EYEBROW}>Production</span>
                        <p className="text-sm text-copy/80">
                           {filmInfo.production_companies
                              .map((c) => c.name)
                              .join(' · ')}
                        </p>
                     </div>
                  )}

               {(filmInfo.homepage || filmInfo.imdb_id) && (
                  <div className="flex flex-wrap justify-center gap-3">
                     {filmInfo.homepage && (
                        <ExternalLink href={filmInfo.homepage}>
                           Homepage
                        </ExternalLink>
                     )}
                     {filmInfo.imdb_id && (
                        <ExternalLink
                           href={`https://www.imdb.com/title/${filmInfo.imdb_id}`}
                        >
                           IMDb
                        </ExternalLink>
                     )}
                  </div>
               )}

               <ReleaseDatesList results={filmInfo.release_dates?.results} />
            </div>

            {filmTrailer && (
               <div className="hero-trailer mt-4 overflow-hidden rounded-lg shadow-lg">
                  <iframe
                     className="h-full w-full"
                     title={`${filmInfo.title} trailer`}
                     src={`https://www.youtube.com/embed/${filmTrailer.key}`}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                  />
               </div>
            )}

            {(directors.length > 0 ||
               writers.length > 0 ||
               topCast.length > 0) && (
               <div className="text-content mt-4 gap-5 rounded-lg p-5 text-copy sm:p-8">
                  <h2 className="text-display-md">Cast &amp; Crew</h2>

                  {(directors.length > 0 || writers.length > 0) && (
                     <dl className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                        {directors.length > 0 && (
                           <Stat
                              label={`Director${directors.length > 1 ? 's' : ''}`}
                           >
                              {directors.map((d) => d.name).join(', ')}
                           </Stat>
                        )}
                        {writers.length > 0 && (
                           <Stat label="Writers">{writers.join(', ')}</Stat>
                        )}
                     </dl>
                  )}

                  {topCast.length > 0 && (
                     <div className="flex flex-col gap-4 border-t border-copy/10 pt-5">
                        <h3 className={`font-sans ${EYEBROW}`}>
                           Top billed cast
                        </h3>
                        <CastList cast={topCast} />
                     </div>
                  )}
               </div>
            )}

            <ReviewList mediaType={MEDIA_TYPES.MOVIE} id={filmInfo.id} />

            <ImageGallery
               mediaType={MEDIA_TYPES.MOVIE}
               id={filmInfo.id}
               title={filmInfo.title}
            />

            {recommendations && recommendations.length > 0 && (
               <div className="text-content mt-4 gap-4 rounded-lg p-5 text-copy sm:p-8">
                  <h2 className="text-display-md">Recommendations</h2>
                  <CardGrid>
                     {recommendations.map((film) => (
                        <FilmCard
                           key={film.id}
                           id={film.id}
                           media_type={film.media_type}
                           title={film.title}
                           poster_path={film.poster_path}
                           release_date={film.release_date}
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

export default FilmInfo;
