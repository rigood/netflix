import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMovieSearchResults, getTvSearchResults, IGetMoviesResult } from "../api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Slider from "../Components/Slider";
import TvSlider from "../Components/TvSlider";
import MovieSearchSlider from "../Components/MovieSearchSlider";
import TvSearchSlider from "../Components/TvSearchSlider";

/* Components Styling */
const Wrapper = styled.div`
  margin-top: 160px;
`;

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 5vw;
  h1 {
    margin-top: 2vw;
    font-size: 2vw;
  }
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieSearchData, isLoading: loadingMovieSearch } = useQuery<IGetMoviesResult>(
    ["moviesearch", keyword],
    () => getMovieSearchResults(keyword)
  );

  const { data: tvSearchData, isLoading: loadingTvSearch } = useQuery<IGetMoviesResult>(
    ["tvSearch", keyword],
    () => getTvSearchResults(keyword)
  );

  const isLoading = loadingMovieSearch || loadingTvSearch;

  return (
    <>
      {isLoading ? (
        <Loader>
          <FontAwesomeIcon icon={faSpinner} spinPulse color="red" />
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <Wrapper>
          <MovieSearchSlider
            movies={movieSearchData?.results}
            title="Movie 검색 결과"
            category="영화"
            keyword={keyword}
          />
          <TvSearchSlider
            movies={tvSearchData?.results}
            title="TV 쇼 검색 결과"
            category="TV 쇼"
            keyword={keyword}
          />
        </Wrapper>
      )}
    </>
  );
}

export default Search;
