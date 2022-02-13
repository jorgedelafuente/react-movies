import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { useAxios } from './../../Services/useAxios.js';
import { baseImagePath, baseImagePathPoster } from '../../Services/config.js';
import Spinner from '../../Components/Spinner/Spinner.jsx';

const MovieInfo = () => {
  const params = useParams();

  const { response, error, loading } = useAxios('movieInfo', params.id);
  if (loading) return <Spinner />;
  if (error) return 'An error has occurred: ' + error.message;

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
        <MovieListContainerParallax
          src={`${baseImagePathPoster}${backdrop_path}`}
        >
          <div>
            <PosterImage src={`${baseImagePath}${poster_path}`} alt="" />
          </div>

          <TextContent>
            <h2>
              <strong></strong>
              {title}
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

const MovieListContainerParallax = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
  padding-top: 20px;
  background-image: url(${(props) => props.src});
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  margin: 0 auto;
`;

const PosterImage = styled.img`
  height: 90%;
  margin: 0 auto;
  transition: opacity 0.3s;
  border-radius: 25px;
  &: hover {
    opacity: 50%;
  }
`;

const TextContent = styled.div`
  color: whitesmoke;
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 15px;
  margin: 10px;
  height: 90%;
  background-color: var(--secondary-background-color);
  border-radius: 25px;
  transition: opacity 0.3s;
  &: hover {
    opacity: 50%;
  }
  @media only screen and (max-width: 600px) {
    width: 90%;
    margin: 0 auto;
    margin-top: 50px;
  }
`;
