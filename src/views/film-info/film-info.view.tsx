import { FilmInfoType } from '@/types/films.types';
import { baseImagePathPoster, baseImagePath } from '@/services/config';
import './film-info.styles.css';

const FilmInfo = ({ filmInfo }: { filmInfo: FilmInfoType }) => {
   return (
      <>
         <div
            className="container-bg"
            style={{
               backgroundImage: `url(${baseImagePathPoster + filmInfo.backdrop_path})`,
            }}
         >
            <div>
               <img src={`${baseImagePath}${filmInfo.poster_path}`} alt="" />
            </div>

            <div className="text-content">
               <h2>
                  <strong>{filmInfo.title}</strong>
               </h2>

               <h3>
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
         </div>
      </>
   );
};

export default FilmInfo;
