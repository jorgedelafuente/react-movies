import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useAxios, baseImagePath } from "./../../Services/useAxios.js";
import Spinner from "../../Components/Spinner/Spinner.jsx";

const MovieInfo = (props) => {
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
    <MovieListContainer>
      {response && (
        <>
          <div>
            <PosterImage src={`${baseImagePath}${poster_path}`} alt="" />
          </div>

          <TextContent>
            <h2>
              <strong></strong>
              {title}
            </h2>

            <h3>
              <strong></strong>
              {tagline}
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
            <div>
              <BackDropImage src={`${baseImagePath}${backdrop_path}`} alt="" />
            </div>
          </TextContent>
        </>
      )}
    </MovieListContainer>
  );
};

export default MovieInfo;

const MovieListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  background: #141414;
  padding-top: 20px;
`;

const PosterImage = styled.img`
  height: 90%;
  margin: 0 auto;
`;

const BackDropImage = styled.img`
  margin: 0 auto;
`;

const TextContent = styled.div`
  color: whitesmoke;
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 15px;
  margin: 10px;
  height: 90%;
  background-color: #282828;
  border-radius: 25px;
`;
