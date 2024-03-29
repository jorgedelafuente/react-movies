import styled from "styled-components";

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
  &:hover {
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
  &:hover {
    opacity: 50%;
  }
  @media only screen and (max-width: 600px) {
    width: 90%;
    margin: 0 auto;
    margin-top: 50px;
  }
`;

export { MovieListContainerParallax, PosterImage, TextContent };
