import styled from "styled-components";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getMovieSearchResults, getTvSearchResults, IGetMoviesResult } from "../api";

/* Components */
import SearchSlider from "../Components/SearchSlider";

/* Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

/* Components Styling */
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

const Notification = styled.h1`
  // Space for Header
  margin-top: 140px;
  padding: 0 60px;
  font-size: 20px;
  font-weight: 500;
  color: #808080;
  strong {
    font-weight: 700;
    color: ${(props) => props.theme.white.darker};
  }
`;

const SliderWrapper = styled.div`
  margin-top: 70px;
`;

function Search() {
  // Extract keyword
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  // Data-fectching
  const { data: movieSearchData, isLoading: loadingMovieSearch } = useQuery<IGetMoviesResult>(
    ["moviesearch", keyword],
    () => getMovieSearchResults(keyword!)
  );

  const { data: tvSearchData, isLoading: loadingTvSearch } = useQuery<IGetMoviesResult>(
    ["tvSearch", keyword],
    () => getTvSearchResults(keyword!)
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
        <>
          <Notification>
            검색 결과는 <strong>최대 20건</strong> 까지 표시됩니다.
          </Notification>
          <SliderWrapper>
            <SearchSlider
              movies={movieSearchData?.results}
              title={`영화 검색 결과 (${movieSearchData?.results.length}건)`}
              category="영화"
              keyword={keyword!}
            />
            <SearchSlider
              movies={tvSearchData?.results}
              title={`TV 쇼 검색 결과 (${tvSearchData?.results.length}건)`}
              category="TV 쇼"
              keyword={keyword!}
            />
          </SliderWrapper>
        </>
      )}
    </>
  );
}

export default Search;
