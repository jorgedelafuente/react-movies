import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "./../Services/useAxios.js";

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { response, error, loading } = useAxios("search", searchQuery);
  const [filmTitles, setFilmTitles] = useState([]);

  const getTitles = (response) => {
    let filmTitles = [];
    if (response && response?.total_results !== 0) {
      filmTitles = response.results.map(({ title, id }) => ({
        title,
        id,
      }));
      setFilmTitles(filmTitles);
    }
  };

  function handleClick(id) {
    navigate(`/movie/${id}`);
  }

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const onFormSubmit = (e) => {
    getTitles(response);
    e.preventDefault();
  };
  return (
    <SearchInputContainer>
      <form onSubmit={onFormSubmit}>
        <Input
          type="text"
          id="searchInput"
          name="searchInput"
          placeholder="Search Movies"
          value={searchQuery}
          onChange={handleChange}
          autocomplete="off"
        ></Input>

        <button type="submit">Submit</button>
        <SearchResultsList>
          {filmTitles.length > 0 && (
            <div>
              {filmTitles.map(({ title, id }) => (
                <button key={id} onClick={() => handleClick(id)}>
                  <>{title}</>
                  <>{id}</>
                </button>
              ))}
            </div>
          )}
        </SearchResultsList>
      </form>
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

const SearchResultsList = styled.div`
  color: white;
`;
