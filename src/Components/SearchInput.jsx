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
      <div>
        <form onSubmit={onFormSubmit}>
          <Input
            type="text"
            id="searchInput"
            name="searchInput"
            placeholder="Use Enter Key to Submit"
            value={searchQuery}
            onChange={handleChange}
            autocomplete="off"
          ></Input>

          <InputButton type="submit">Submit</InputButton>
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
      </div>
    </SearchInputContainer>
  );
};

export default SearchInput;

const Input = styled.input``;

const InputButton = styled.button`
  display: none;
`;

const SearchInputContainer = styled.div`
  padding: 30px;
`;

const SearchResultsList = styled.div`
  color: white;
`;
