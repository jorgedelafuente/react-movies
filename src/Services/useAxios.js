import { useState, useEffect } from "react";
import axios from "axios";

/**
 * useAxios.
 *
 * A hook that fetches from the paramOptions object which contain the api fetching options.
 *
 * @param {string} paramOption Reference to one of the keys in the paramOptions object.
 * @param {string} searchQuery the dynamic part of the query which could be an ID or a search text phrase.
 */

const apiKey = process.env.REACT_APP_APIKEY;
axios.defaults.baseURL = " https://api.themoviedb.org/3";

export const useAxios = (paramOption, searchQuery = "") => {
  const paramOptions = {
    popular: `/movie/popular${apiKey}&language=en-US&page=1`,
    movieInfo: `movie/${searchQuery}${apiKey}&language=en-US`,
    search: `/search/movie${apiKey}&query=${searchQuery}`,
  };
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await axios.request(paramOptions[paramOption]);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOption === "popular") {
      fetchData(paramOption, searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (paramOption === "search" || paramOption === "movieInfo") &&
      searchQuery !== ""
    ) {
      fetchData(paramOption, searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return { response, error, loading };
};
