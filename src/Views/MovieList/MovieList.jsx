import React from "react";
import styled from "styled-components";
import MockData from "../../MovieListMock.json";

import { baseImagePath } from "../../Services/config";

const MovieList = (props) => {
  return (
    <MovieListContainer>
      {MockData.results.map(
        ({ id, title, vote_average, release_date, poster_path }) => (
          <MovieCard key={id}>
            <div>{release_date}</div>
            <div>{title}</div>
            <div>{vote_average}</div>
            <img src={`${baseImagePath}${poster_path}`} alt="" />
          </MovieCard>
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
