import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";

import { IMovie } from "../api";
import { makeImgPath } from "../utils";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCirclePlay,
  faCirclePlus,
  faCircleXmark,
  faClose,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "../useWindowDimensions";

import { useMatch, useNavigate } from "react-router-dom";

interface ISliderProps {
  movies?: IMovie[];
  title: string;
  category: string;
}

const Title = styled.div`
  margin-bottom: 1vw;
  padding: 0 60px;
  h3 {
    font-size: 1.4vw;
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 15vw;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  padding: 0 60px;
`;

const Box = styled(motion.div)<{ bg: string }>`
  overflow: hidden;
  padding-top: 56.25%;
  border-radius: 0.2vw;
  background-image: url(${(props) => props.bg});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -20,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Arrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: 3.5vw;
  width: 60px;
  height: 11vw;
  font-size: 2vw;
  opacity: 0;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  z-index: 1;
  &:hover {
    opacity: 1;
    scale: 1.2;
  }
`;

const LeftArrow = styled(Arrow)`
  left: 0;
`;
const RightArrow = styled(Arrow)`
  right: 0;
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 5%;
  border-bottom-left-radius: 0.2vw;
  border-bottom-right-radius: 0.2vw;
  background-color: ${(props) => props.theme.black.lighter};
  word-break: keep-all;
  opacity: 0;
  z-index: 9999;
  .icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5vw;
    font-size: 1.2vw;
    .play,
    .plus {
      margin-right: 0.3vw;
    }
    .heart {
      color: ${(props) => props.theme.red};
    }
  }
  h4 {
    margin-bottom: 0.3vw;
    font-size: 0.8vw;
  }
  .subInfo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-weight: 500;
    span {
      margin-bottom: 0.2vw;
      font-size: 0.6vw;
    }
    span:first-child {
      margin-right: 0.5vw;
      color: ${(props) => props.theme.green};
    }
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 40%;
  min-width: 480px;
  height: fit-content;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.veryDark};
  z-index: 9999;
  overflow: hidden;
`;

const BigCover = styled.div<{ bg: string }>`
  position: relative;
  width: 100%;
  padding-top: 60%;
  background-image: linear-gradient(transparent, black), url(${(props) => props.bg});
  background-size: cover;
  background-position: center top;
  .closeBtn {
    position: absolute;
    top: 5%;
    right: 5%;
    font-size: 24px;
    cursor: pointer;
  }
`;

const BigPoster = styled.div<{ bg: string }>`
  position: absolute;
  bottom: 30px;
  right: 5%;
  width: 120px;
  height: 180px;
  border-radius: 5px;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  box-shadow: 6px 5px 29px 10px #000000;
`;

const BigCoverInfo = styled.div`
  position: absolute;
  bottom: 0%;
  left: 5%;
`;

const BigTitle = styled.h1`
  margin-bottom: 8px;
  font-size: 28px; ;
`;

const BigSubInfo = styled.div`
  margin-bottom: 20px;
  span:first-child {
    margin-right: 15px;
    color: ${(props) => props.theme.green};
  }
`;

const BigContent = styled.div`
  display: grid;
  grid-template-columns: auto 120px;
  padding: 0 5% 5% 5%;
`;

const BigOverview = styled.p`
  width: 90%;
  word-break: keep-all;
  font-size: 14px;
  font-weight: 300;
`;

const BigIcons = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 40px;
  cursor: pointer;
  .play,
  .plus {
    color: ${(props) => props.theme.black.lighter};
    transition: all 0.3s ease-in-out;
  }
  .play:hover,
  .plus:hover {
    scale: 1.2;
    color: ${(props) => props.theme.white.lighter};
  }
`;

const offset = 6;

function Slider({ movies, title, category }: ISliderProps) {
  const width = useWindowDimensions();

  const [back, setBack] = useState(false);
  const [movingNext, setMovingNext] = useState(false);
  const [movingPrev, setMovingPrev] = useState(false);

  const [index, setIndex] = useState(0);
  const totalMovies = movies?.length! - 1;
  const maxIndex = Math.floor(totalMovies / offset) - 1;

  const increaseIndex = () => {
    if (movies) {
      if (movingNext) return;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setBack(false);
      setMovingNext(true);
    }
  };
  const decreaseIndex = () => {
    if (movies) {
      if (movingPrev) return;
      setIndex((prev) => prev - 1);
      setBack(true);
      setMovingPrev(true);
    }
  };
  const toggleMoving = () => {
    setMovingNext(false);
    setMovingPrev(false);
  };

  const bigMovieMatch = useMatch("/movies/:movieId");
  console.log(bigMovieMatch);
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => navigate(-1);
  const onCloseBtnClicked = () => navigate(-1);
  const { scrollY } = useScroll();
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movies?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  return (
    <>
      <Title>
        <h3>{title}</h3>
      </Title>
      <Wrapper>
        {index === 0 ? null : (
          <LeftArrow onClick={decreaseIndex}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </LeftArrow>
        )}
        <AnimatePresence initial={false} onExitComplete={toggleMoving} custom={width}>
          <Row
            key={index}
            initial={{ x: back ? "-100vw" : width - 130 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: back ? "100vw" : -width + 60 }}
            transition={{ type: "tween", duration: 0.7 }}
          >
            {movies
              ?.slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={movie.id}
                  bg={makeImgPath(movie.backdrop_path, "w500")}
                  custom={width}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Info variants={infoVariants}>
                    <div className="icons">
                      <div>
                        <FontAwesomeIcon icon={faCirclePlay} className="play" />
                        <FontAwesomeIcon icon={faCirclePlus} className="plus" />
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faHeart} className="heart" beat />
                      </div>
                    </div>
                    <h4>{category === "영화" ? movie.title : movie.name}</h4>
                    <div className="subInfo">
                      <span>
                        개봉 : {category === "영화" ? movie.release_date : movie.first_air_date}
                      </span>
                      <span>평점 : ⭐{movie.vote_average} 점</span>
                    </div>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightArrow onClick={increaseIndex}>
          <FontAwesomeIcon icon={faAngleRight} />
        </RightArrow>
      </Wrapper>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie>
              {clickedMovie && (
                <>
                  <BigCover bg={makeImgPath(clickedMovie.poster_path, "w500")}>
                    <BigPoster bg={makeImgPath(clickedMovie.poster_path, "w500")} />
                    <BigCoverInfo>
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigSubInfo>
                        <span>개봉 : {clickedMovie.release_date}</span>
                        <span>평점 : ⭐{clickedMovie.vote_average} 점</span>
                      </BigSubInfo>
                    </BigCoverInfo>
                    <FontAwesomeIcon
                      className="closeBtn"
                      icon={faClose}
                      onClick={onCloseBtnClicked}
                    />
                  </BigCover>
                  <BigContent>
                    <BigOverview>
                      {clickedMovie.overview ? clickedMovie.overview : "준비중입니다."}
                    </BigOverview>
                    <BigIcons>
                      <FontAwesomeIcon icon={faCirclePlay} className="play" bounce />
                      <FontAwesomeIcon icon={faCirclePlus} className="plus" />
                    </BigIcons>
                  </BigContent>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Slider;
