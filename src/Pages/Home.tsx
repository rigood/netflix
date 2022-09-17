import styled from "styled-components";

/* Routing */
import { useMatch, PathMatch, useNavigate } from "react-router-dom";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import {
  IGetMoviesResult,
  getNowPlayingMovies,
  getLatestMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetail,
} from "../api";

/* Components */
import Banner from "../Components/Banner";

/* Components Styling */
const Wrapper = styled.div``;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 5vw;
`;

function Home() {
  const useMultipleQuery = () => {
    const nowPlaying = useQuery<IGetMoviesResult>(["nowPlaying"], getNowPlayingMovies);
    const latest = useQuery<IGetMoviesResult>(["latest"], getLatestMovies);
    const topRated = useQuery<IGetMoviesResult>(["topRated"], getTopRatedMovies);
    const upcoming = useQuery<IGetMoviesResult>(["upcoming"], getUpcomingMovies);
    return [nowPlaying, latest, topRated, upcoming];
  };

  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpcoming, data: upcomingData },
  ] = useMultipleQuery();

  const isLoading = loadingNowPlaying || loadingLatest || loadingTopRated || loadingUpcoming;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <>
          <Banner movie={nowPlayingData?.results[7]} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
