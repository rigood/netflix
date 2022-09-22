import styled from "styled-components";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import { IGetMoviesResult, getAiringTodayTv, getPopularTv, getTopRatedTv } from "../api";

/* Components */
import Banner from "../Components/Banner";

/* Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Slider from "../Components/Slider";

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
  // Move up Slider
  position: relative;
  top: -15vw;
`;

function Tv() {
  // Data-fectching
  const useMultipleQuery = () => {
    const airingTodayTv = useQuery<IGetMoviesResult>(["airingTodayTv"], getAiringTodayTv);
    const popularTv = useQuery<IGetMoviesResult>(["popularTv"], getPopularTv);
    const topRatedTv = useQuery<IGetMoviesResult>(["topRatedTv"], getTopRatedTv);
    return [airingTodayTv, popularTv, topRatedTv];
  };

  const [
    { isLoading: loadingAiringTodayTv, data: airingTodayTvData },
    { isLoading: loadingPopularTv, data: popularTvData },
    { isLoading: loadingTopRatedTv, data: topRatedTvData },
  ] = useMultipleQuery();

  const isLoading = loadingAiringTodayTv || loadingPopularTv || loadingTopRatedTv;

  return (
    <>
      {isLoading ? (
        <Loader>
          <FontAwesomeIcon icon={faSpinner} color="red" spinPulse />
          <h1>잠시만 기다려주세요</h1>
        </Loader>
      ) : (
        <>
          <Banner movie={airingTodayTvData?.results[6]} category="TV 쇼" />
          <SliderWrapper>
            <Slider
              movies={airingTodayTvData?.results}
              title="방영 중인 TV Shows"
              category="TV 쇼"
              section="airingtoday"
            />
            <Slider
              movies={popularTvData?.results}
              title="인기 TV 콘텐츠"
              category="TV 쇼"
              section="popular"
            />
            <Slider
              movies={topRatedTvData?.results}
              title="최고 평점 TV Shows"
              category="TV 쇼"
              section="toprated"
            />
          </SliderWrapper>
        </>
      )}
    </>
  );
}

export default Tv;
