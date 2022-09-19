import styled from "styled-components";

/* Data fetching */
import { IMovie } from "../api";
import { makeImgPath } from "../utils";

/* Components Styling */
const Hero = styled.div<{ bg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 56.25vw;
  min-height: 400px; // For mobile
  padding: 0 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bg});
  background-size: cover; // Fill the entire background without gaps
`;

const ContentsWrapper = styled.div`
  width: 40%;
`;

const Title = styled.h1`
  margin-bottom: 1vw;
  font-size: 2.5vw;
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.7);
`;

const Ranking = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1vw;
  img {
    width: 1.6vw;
    margin-right: 0.5vw;
  }
  h2 {
    font-size: 1.6vw;
    text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.7);
  }
`;

const Overview = styled.p`
  font-size: 1.2vw;
  font-weight: 400;
  word-wrap: break-word;
  word-break: keep-all;
`;

/* Interface */
interface IBannerProps {
  movie?: IMovie;
  category: string;
}

function Banner({ movie, category }: IBannerProps) {
  return (
    <Hero bg={makeImgPath(movie?.backdrop_path || "")}>
      <ContentsWrapper>
        <Title>{category === "영화" ? movie?.title : movie?.name}</Title>
        <Ranking>
          <img src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Netflix logo" />
          <h2>오늘의 {category} 순위 7위</h2>
        </Ranking>
        <Overview>
          {movie?.overview
            ? movie?.overview.length! > 100
              ? `${movie?.overview.slice(0, 100)}...`
              : movie?.overview
            : "등록된 Overview 정보가 없습니다."}
        </Overview>
      </ContentsWrapper>
    </Hero>
  );
}

export default Banner;
