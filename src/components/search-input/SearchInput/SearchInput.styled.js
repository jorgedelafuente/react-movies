import styled from "styled-components";

const Input = styled.input`
  width: 200px;
`;

const InputButton = styled.button`
  display: none;
`;

const ClearButton = styled.button`
  background-color: black;
  border: 1px solid var(--background-color);
  color: white;
  width: ${(props) => (props.buttonMode !== "invert" ? "auto" : "125px")};
  &:hover {
    cursor: pointer;
  }
`;

const InputBox = styled.div`
  margin: 0 auto;
  padding: 10px;
`;

const SearchInputContainer = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const SearchResultsList = styled.div`
  position: fixed;
  display: ${(props) => (props.showList ? "flex" : "none")};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  flex-direction: column;
  margin: 0 auto;
  padding: 10px;
`;

const SearchResultButton = styled.button`
  font-size: 15px;
  padding: 2.5px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: var(--secondary-background-color);
  color: white;
  border-radius: 10px;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: black;
  }
`;

export {
  Input,
  InputButton,
  ClearButton,
  InputBox,
  SearchInputContainer,
  SearchResultButton,
  SearchResultsList,
};
