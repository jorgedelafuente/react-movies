import { useParams } from "react-router-dom";

import { useAxios } from "./../../Services/useAxios.js";
import { baseImagePath, baseImagePathPoster } from "../../Services/config.js";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import { MovieListContainerParallax, PosterImage, TextContent } from "./MovieInfo.styled.js";

const MovieInfo = () => {
  const params = useParams();

  const { response, error, loading } = useAxios("movieInfo", params.id);
  if (loading) return <Spinner />;
  if (error) return "An error has occurred: " + error.message;

  const {
    release_date,
    title,
    vote_average,
    homepage,
    overview,
    runtime,
    tagline,
    poster_path,
    backdrop_path,
  } = response || {};

  return (
    <>
      {response && (
        <MovieListContainerParallax src={`${baseImagePathPoster}${backdrop_path}`}>
          <div>
            <PosterImage src={`${baseImagePath}${poster_path}`} alt='' />
          </div>

          <TextContent>
            <h2>
              <strong>{title}</strong>
            </h2>

            <h3>
              <strong>{tagline}</strong>
            </h3>

            <br />

            <p>
              <strong>Overview : </strong>
              {overview}
            </p>

            <br />

            <div>
              <strong>Averag Rating : </strong>
              {vote_average}
            </div>

            <div>
              <strong>Homepage : </strong>
              {homepage}
            </div>

            <div>
              <strong>Duration : </strong>
              {runtime} minutes
            </div>

            <div>
              <strong>Release Date : </strong>
              {release_date}
            </div>
            <br />
          </TextContent>
        </MovieListContainerParallax>
      )}
    </>
  );
};

export default MovieInfo;
