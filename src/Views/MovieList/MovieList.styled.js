import styled from "styled-components";

const MovieListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
`;

const MovieCard = styled.div`
  width: 300px;
  margin: 20px;
  position: relative;
  overflow: hidden;
  display: block;
  transition: all 250ms ease-in-out;
  transition-timing-function: cubic-bezier(0.1, 0.1, 0.6, 0.9);
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    transform: scale(1.15);
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
  flex-direction: column;
  background: rgba(255, 255, 255, 0.4);
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  font-size: 0.9rem;
  padding: 1em;
  h2 {
    padding-bottom: 10px;
    text-align: center;
  }
`;

export { MovieListContainer, MovieCard, MovieImage, MovieContent };
