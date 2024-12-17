import Container from '@/components/layout/container/container.component';
import type { FilmInfoType, FilmVideoType } from '@/types/films.types';
import { baseImagePathPoster, baseImagePath } from '@/services/config';
import './film-info.styles.scss';

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

               <h3 className="text-2xl">
                  <strong>{filmInfo.tagline}</strong>
               </h3>

               <br />

               <p>
                  <strong>Overview : </strong>
                  {filmInfo.overview}
               </p>

               <br />

               <div>
                  <strong>Averag Rating : </strong>
                  {filmInfo.vote_average}
               </div>

               <div>
                  <strong>Homepage : </strong>
                  {filmInfo.homepage}
               </div>

               <div>
                  <strong>Duration : </strong>
                  {filmInfo.runtime} minutes
               </div>

               <div>
                  <strong>Release Date : </strong>
                  {filmInfo.release_date}
               </div>
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
