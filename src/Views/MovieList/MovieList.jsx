import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAxios } from "./../../Services/useAxios.js";
import { baseImagePath } from "../../Services/config.js";
import Spinner from "../../Components/Spinner/Spinner.jsx";

const MovieList = () => {
  const navigate = useNavigate();
  const { response, error, loading } = useAxios("popular");
  if (loading) return <Spinner />;
  if (error) return "An error has occurred: " + error.message;

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
