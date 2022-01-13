import React from "react";
import styled from "styled-components";

import SearchInput from "./SearchInput.jsx";

const NavBar = () => {
  return (
    <SearchInputContainer>
      <SearchInput />
    </SearchInputContainer>
  );
};

export default NavBar;

const SearchInputContainer = styled.div`
  display: flex;
  background: #141414;
`;
