import styled from "styled-components";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";

/* Components */
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";

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

const SliderWrapper = styled.div`
  // Lift up to display Slider
  position: relative;
  top: -15vw;
`;

function Home() {
  // Data-fectching
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
    <>
      {isLoading ? (
        <Loader>
          <FontAwesomeIcon icon={faSpinner} color="red" spinPulse />
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <>
          <Banner movie={nowPlayingData?.results[0]} category="영화" />
          <SliderWrapper>
            <Slider movies={nowPlayingData?.results} title="현재 상영 중인 영화" category="영화" />
            <Slider
              movies={topRatedData?.results}
              title="오늘의 한국 TOP 10 영화"
              category="영화"
            />
            <Slider movies={upcomingData?.results} title="개봉 예정 영화" category="영화" />
          </SliderWrapper>
        </>
      )}
    </>
  );
}

export default Home;
