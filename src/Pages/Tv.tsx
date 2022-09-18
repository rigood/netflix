import styled from "styled-components";

/* Routing */
import { useMatch, PathMatch, useNavigate } from "react-router-dom";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  getAiringTodayTv,
  getPopularTv,
  getTopRatedTv,
  getLatestTv,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";

/* Components */
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import TvSlider from "../Components/TvSlider";

/* Components Styling */
const Wrapper = styled.div``;

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

const SlideWrapper = styled.div`
  position: relative;
  top: -15vw;
`;

function Tv() {
  const useMultipleQuery = () => {
    const latestTv = useQuery<IGetMoviesResult>(["latestTv"], getLatestTv);
    const airingTodayTv = useQuery<IGetMoviesResult>(["airingTodayTv"], getAiringTodayTv);
    const popularTv = useQuery<IGetMoviesResult>(["popularTv"], getPopularTv);
    const topRatedTv = useQuery<IGetMoviesResult>(["topRatedTv"], getTopRatedTv);
    return [latestTv, airingTodayTv, popularTv, topRatedTv];
  };

  const [
    { isLoading: loadingLatestTv, data: latestTvData },
    { isLoading: loadingAiringTodayTv, data: airingTodayTvData },
    { isLoading: loadingPopularTv, data: popularTvData },
    { isLoading: loadingTopRatedTv, data: topRatedTvData },
  ] = useMultipleQuery();

  const isLoading =
    loadingLatestTv || loadingAiringTodayTv || loadingPopularTv || loadingTopRatedTv;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <FontAwesomeIcon icon={faSpinner} spinPulse color="red" />
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <>
          <SlideWrapper>
            <Banner movie={airingTodayTvData?.results[0]} category="TV 쇼" />
            <TvSlider
              movies={airingTodayTvData?.results}
              title="방영중인 TV Shows"
              category="TV 쇼"
            />
            <TvSlider movies={popularTvData?.results} title="인기 TV 콘텐츠" category="TV 쇼" />
            <TvSlider
              movies={topRatedTvData?.results}
              title="최고 평점 TV Shows"
              category="TV 쇼"
            />
          </SlideWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
