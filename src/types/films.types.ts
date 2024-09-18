export type FilmList = { results: FilmInfoType[] };

export type FilmInfoType = {
   title: string;
   id: string;
   original_title: string;
   overview: string;
   backdrop_path: string;
   poster_path: string;
   tagline: string;
   vote_average: string;
   homepage: string;
   runtime: string;
   release_date: string;
};

export type FilmVideoList = { results: FilmVideoType[] };

export type FilmVideoType = {
   site: string;
   type: string;
   name: string;
   key: string;
};
