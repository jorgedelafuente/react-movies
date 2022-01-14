import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../Services/useAxios.js";
import debounce from "lodash/debounce";

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const { response } = useAxios("search", apiSearchQuery);
  const [filmTitles, setFilmTitles] = useState([]);

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

  const sendQuery = (query) => {
    setApiSearchQuery(query);
  };

  function handleClick(id) {
    navigate(`/movie/${id}`);
    setFilmTitles([]);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce((q) => sendQuery(q), 300),
    []
  );

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    delayedSearch(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      delayedSearch(searchQuery);
      getTitles(response);
    }
  };

  const clearSearchResults = () => {
    setSearchQuery("");
    setFilmTitles([]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    delayedSearch(searchQuery);
    getTitles(response);
  };

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <SearchInputContainer>
          <InputBox>
            <Input
              type="text"
              id="searchInput"
              name="searchInput"
              placeholder="Use Enter Key to Submit"
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={handleEnterKey}
              autocomplete="off"
            ></Input>
            <InputButton type="submit">Submit</InputButton>
            <ClearButton type="button" onClick={clearSearchResults}>
              -
            </ClearButton>
          </InputBox>
        </SearchInputContainer>
      </form>
      <SearchResultsList>
        {filmTitles.length > 0 &&
          filmTitles.map(({ title, id }) => (
            <div key={id}>
              <SearchResultButton onClick={() => handleClick(id)}>
                {title}
              </SearchResultButton>
            </div>
          ))}
      </SearchResultsList>
    </>
  );
};

export default SearchInput;

const Input = styled.input``;

const InputButton = styled.button`
  display: none;
`;

const ClearButton = styled.button`
  background-color: black;
  border: 1px solid : #282828;
  color: white;
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
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  background-color: #141414;
  background: rgba(204, 204, 204, 0.15);
  margin-top: 60px;
  padding: 0px 0px 15px 0px;
  overflow: auto;
  white-space: nowrap;
`;

const SearchResultButton = styled.button`
  font-size: 15px;
  padding: 2.5px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: #282828;
  color: white;
  border-radius: 10px;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #141414;
  }
`;
