import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useAxios } from "./../../Services/useAxios.js";
import { baseImagePath } from "../../Services/config.js";
import Spinner from "../../Components/Spinner/Spinner.jsx";

const MovieList = () => {
  const { response, error, loading } = useAxios("popular");
  if (loading) return <Spinner />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <MovieListContainer>
      {response &&
        response.results.map(({ id, poster_path, overview, title }) => (
          <Link to={`movie/${id}`} rel="noopener noreferrer">
            <MovieCard key={id}>
              <MovieImage src={`${baseImagePath}${poster_path}`} alt={title} />
              <MovieContent className="content">{overview}</MovieContent>
            </MovieCard>
          </Link>
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
`;

const MovieCard = styled.div`
  width: 300px;
  margin: 20px;
  position: relative;
  overflow: hidden;
  display: block;
  transition: 250ms ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
  &:hover .content {
    opacity: 1;
  }
  &:hover img {
    border: 1px solid red;
    filter: blur(5px);
  }
`;

const MovieImage = styled.img`
  aspect-ratio: 1/1.5;
  object-fit: cover;
  object-position: center;
`;

const MovieContent = styled.div`
  opacity: 0;
  display: flex;
  background: rgba(255, 255, 255, 0.4);
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  font-size: 0.9rem;
  padding: 1em;
`;
