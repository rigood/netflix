import styled from "styled-components";

/* Data fetching */
import { IMovie } from "../api";
import { makeImgPath } from "../utils";

interface IBannerProps {
  movie?: IMovie;
  category: string;
}

const Hero = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 56.25vw;
  min-height: 350px;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const HeroWrapper = styled.div`
  width: 36%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1vw;
  h1 {
    font-size: 2.5vw;
    text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.7);
  }
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

const Overview = styled.div`
  p {
    font-size: 1.2vw;
    font-weight: 400;
    word-break: keep-all;
  }
`;

function Banner({ movie, category }: IBannerProps) {
  return (
    <Hero bgPhoto={makeImgPath(movie?.backdrop_path || "")}>
      <HeroWrapper>
        <Title>
          <h1>{category === "영화" ? movie?.title : movie?.name}</h1>
        </Title>
        <Ranking>
          <img src={process.env.PUBLIC_URL + "/assets/logo_sm.png"} alt="logo" />
          <h2>오늘의 {category} 순위 1위</h2>
        </Ranking>
        <Overview>
          <p>
            {movie?.overview.length! > 80 ? `${movie?.overview.slice(0, 80)}...` : movie?.overview}
          </p>
        </Overview>
      </HeroWrapper>
    </Hero>
  );
}

export default Banner;
