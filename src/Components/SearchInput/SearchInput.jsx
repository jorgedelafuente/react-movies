import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../Services/useAxios.js";
import debounce from "lodash/debounce";

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [filmTitles, setFilmTitles] = useState([]);
  const { response } = useAxios("search", apiSearchQuery);

  const getTitles = (response) => {
    let filmTitlesArray = [];
    if (response && response?.total_results !== 0) {
      filmTitlesArray = response.results.map(({ title, id }) => ({
        title,
        id,
      }));
      setFilmTitles(filmTitlesArray);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce((q) => setApiSearchQuery(q), 300),
    [],
  );

  useEffect(() => {
    if (apiSearchQuery.length > 0 && searchQuery === apiSearchQuery) {
      getTitles(response);
    }
  }, [searchQuery, apiSearchQuery, response]);

  useEffect(() => {
    clearSearchResults();
  }, []);

  function handleClick(id) {
    navigate(`/movie/${id}`);
    setFilmTitles([]);
  }

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearchResults = () => {
    setSearchQuery("");
    setFilmTitles([]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    delayedSearch(searchQuery);
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <SearchInputContainer>
          <InputBox>
            <Input
              type='text'
              id='searchInput'
              name='searchInput'
              placeholder='Use Enter Key to Submit'
              value={searchQuery}
              onChange={handleChange}
              autocomplete='false'
            ></Input>
            <InputButton type='submit'>Submit</InputButton>
            <ClearButton type='button' onClick={clearSearchResults}>
              -
            </ClearButton>
          </InputBox>
        </SearchInputContainer>
      </form>
      <SearchResultsList showList={filmTitles.length > 0}>
        {filmTitles.length > 0 && (
          <>
            <ClearButton type='button' onClick={clearSearchResults} buttonMode={"invert"}>
              Clear Results
            </ClearButton>
            {filmTitles.map(({ title, id }) => (
              <div key={id}>
                <SearchResultButton onClick={() => handleClick(id)}>{title}</SearchResultButton>
              </div>
            ))}
          </>
        )}
      </SearchResultsList>
    </>
  );
};

export default SearchInput;

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
