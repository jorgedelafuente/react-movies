import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import debounce from "lodash/debounce";
import { useAxios } from "../../Services/useAxios.js";
import {
  Input,
  InputButton,
  ClearButton,
  InputBox,
  SearchInputContainer,
  SearchResultsList,
  SearchResultButton,
} from "./SearchInput.styled.js";

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
