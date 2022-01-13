import React from "react";
import styled from "styled-components";

const SearchInput = () => {
  return (
    <SearchInputContainer>
      <Input
        type="text"
        id="fname"
        name="fname"
        placeholder="Search Movies"
      ></Input>
    </SearchInputContainer>
  );
};

export default SearchInput;

const Input = styled.input`
  height: 30px;
`;

const SearchInputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  text-align: center;
  padding: 10px;
`;
