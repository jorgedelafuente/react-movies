import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.REACT_APP_APIKEY;
axios.defaults.baseURL = " https://api.themoviedb.org/3";
export const baseImagePath = "https://image.tmdb.org/t/p/w500/";

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
    if (paramOption !== "search") {
      fetchData(paramOption, searchQuery);
    }
  }, []);

  useEffect(() => {
    if (
      (paramOption === "search" || paramOption === "movieInfo") &&
      searchQuery !== ""
    ) {
      fetchData(paramOption, searchQuery);
    }
  }, [searchQuery]);

  return { response, error, loading };
};
