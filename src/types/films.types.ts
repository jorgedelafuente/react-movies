export type FilmList = {
   results: FilmInfoType[];
};

export type FilmInfoType = {
   title: string;
   id: number;
   original_title: string;
   overview: string;
   backdrop_path: string;
   poster_path: string;
   tagline: string;
   homepage: string;
   runtime: number;
   release_date: string;
   vote_average?: number;
   vote_count?: number;
};

export type FilmVideoList = {
   results: FilmVideoType[];
};

export type FilmVideoType = {
   site: string;
   type: string;
   name: string;
   key: string;
};
