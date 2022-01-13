import React from "react";
import styled from "styled-components";
import MockData from "../../MovieInfoMock.json";
import { baseImagePath } from "../../Services/config";

const MovieInfo = (props) => {
  const {
    id,
    title,
    vote_average,
    release_date,
    budget,
    homepage,
    overview,
    revenue,
    runtime,
    tagline,
    poster_path,
    backdrop_path,
  } = MockData;
  return (
    <MovieListContainer>
      <div key={id}>
        <div>{release_date}</div>
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
      </div>
    </MovieListContainer>
  );
};

export default MovieInfo;

const MovieListContainer = styled.div`
  padding: 0 10%;
`;
