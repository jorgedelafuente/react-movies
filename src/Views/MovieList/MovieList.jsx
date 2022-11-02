import React from "react";
import { Link } from "react-router-dom";

import { useAxios } from "./../../Services/useAxios.js";
import { baseImagePath } from "../../Services/config.js";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import { MovieListContainer, MovieCard, MovieImage, MovieContent } from "./MovieList.styled.js";

const MovieList = () => {
  const { response, error, loading } = useAxios("popular");
  if (loading) return <Spinner />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <MovieListContainer>
      {response &&
        response.results.map(({ id, poster_path, overview, title }) => (
          <Link key={id} to={`movie/${id}`} rel='noopener noreferrer'>
            <MovieCard>
              <MovieImage src={`${baseImagePath}${poster_path}`} alt={title} />
              <MovieContent className='content'>
                <h2>{title}</h2>
                {overview}
              </MovieContent>
            </MovieCard>
          </Link>
        ))}
    </MovieListContainer>
  );
};

export default MovieList;
