import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAxios, baseImagePath } from "./../../Services/useAxios.js";

const MovieList = (props) => {
  const { response, error, loading } = useAxios("popular");
  const navigate = useNavigate();

  return (
    <MovieListContainer>
      {response &&
        response.results.map(({ id, poster_path }) => (
          <MovieCard key={id} onClick={() => navigate(`movie/${id}`)}>
            <img src={`${baseImagePath}${poster_path}`} alt="" />
          </MovieCard>
        ))}
    </MovieListContainer>
  );
};

export default MovieList;

const MovieListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #141414;
`;

const MovieCard = styled.div`
  width: 110px;
  width: 300px;
  margin: 20px;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;
