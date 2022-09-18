import styled from "styled-components";

/* Routing */
import { useMatch, PathMatch, useNavigate } from "react-router-dom";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetail,
} from "../api";

/* Components */
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

/* Components Styling */
const Wrapper = styled.div``;

const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 3vw;
  h1 {
    margin-top: 2vw;
  }
`;

const SlideWrapper = styled.div`
  position: relative;
  top: -15vw;
`;

function Home() {
  const useMultipleQuery = () => {
    const nowPlaying = useQuery<IGetMoviesResult>(["nowPlaying"], getNowPlayingMovies);
    const topRated = useQuery<IGetMoviesResult>(["topRated"], getTopRatedMovies);
    const upcoming = useQuery<IGetMoviesResult>(["upcoming"], getUpcomingMovies);
    return [nowPlaying, topRated, upcoming];
  };

  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpcoming, data: upcomingData },
  ] = useMultipleQuery();

  const isLoading = loadingNowPlaying || loadingTopRated || loadingUpcoming;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <FontAwesomeIcon icon={faSpinner} spinPulse color="red" />
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <>
          <Banner movie={nowPlayingData?.results[7]} />
          <SlideWrapper>
            <Slider movies={nowPlayingData?.results} title="지금 뜨는 콘텐츠" />
            <Slider movies={topRatedData?.results} title="오늘 한국 TOP 10 영화" />
            <Slider movies={upcomingData?.results} title="개봉 예정 영화" />
          </SlideWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
