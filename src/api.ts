const API_KEY = "5836da8588c0e9fe7dc6f7c56764dae7";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  title: string;
  name: string;
  overview: string;
  release_date: string;
  first_air_date: string;
  vote_average: number;
  backdrop_path: string;
  poster_path: string;
}

export interface IGetMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGenres {
  id: number;
  name: string;
}

export interface IGetDetailResult {
  id: number;
  title: string;
  name: string;
  genres: IGenres[];
  runtime: number;
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface ICast {
  name: string;
  original_name: string;
  profile_path: string;
  character: string;
}

export interface IGetCreditsResult {
  cast: ICast[];
}

/* Movie Data fetcher */

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getLatestMovies() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

/* TV Data fetcher */

export function getLatestTv() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getAiringTodayTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

/* Search Data fetcher */

export function getMovieSearchResults(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&language=ko-KR&region=kr`
  ).then((response) => response.json());
}

export function getTvSearchResults(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&language=ko-KR&region=kr`
  ).then((response) => response.json());
}

/* Detail Data fetcher */

export function getDetailMovie(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getDetailTv(id: string) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

/* Cast Data fetcher */

export function getCreditsMovie(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}

export function getCreditsTv(id: string) {
  return fetch(`${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR&region=kr`).then(
    (response) => response.json()
  );
}
