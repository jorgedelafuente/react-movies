import React from "react";
import styled from "styled-components";
import { useAxios, baseImagePath } from "./../../Services/useAxios.js";

const MovieInfo = (props) => {
  const { response, error, loading } = useAxios("movieInfo", "movieId");

  const {
    release_date,
    title,
    budget,
    vote_average,
    homepage,
    overview,
    revenue,
    runtime,
    tagline,
    poster_path,
    backdrop_path,
  } = response || {};

  return (
    <MovieListContainer>
      {response && (
        <>
          <div>{release_date || ""}</div>
          <div>{title}</div>
          <div>{budget}</div>
          <div>{vote_average}</div>
          <div>{homepage}</div>
          <div>{overview}</div>
          <div>{revenue}</div>
          <div>{runtime}</div>
          <div>{tagline}</div>
          <img src={`${baseImagePath}${poster_path}`} alt="" />
          <img src={`${baseImagePath}${backdrop_path}`} alt="" />
        </>
      )}
    </MovieListContainer>
  );
};

export default MovieInfo;

const MovieListContainer = styled.div`
  padding: 0 10%;
`;
