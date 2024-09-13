export type FilmList = { results: FilmType[] };
export type FilmType = {
    title: string;
    id: string;
    original_title: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    tagline: string;
};
