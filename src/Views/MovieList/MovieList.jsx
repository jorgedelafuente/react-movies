import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { useAxios, baseImagePath } from "./../../Services/useAxios.js";

const MovieList = (props) => {
  const { response, error, loading } = useAxios("popular");

  return (
    <MovieListContainer>
      {response &&
        response.results.map(
          ({ id, title, vote_average, release_date, poster_path }) => (
            <Link key={id} to={`movie/${id}`}>
              <MovieCard>
                <div>{release_date}</div>
                <div>{title}</div>
                <div>{vote_average}</div>
                <img src={`${baseImagePath}${poster_path}`} alt="" />
              </MovieCard>
            </Link>
          )
        )}
    </MovieListContainer>
  );
};

export default MovieList;

const MovieListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;

const MovieCard = styled.div`
  padding: 2px;
  width: 110px;
  border: 1px solid black;
`;
