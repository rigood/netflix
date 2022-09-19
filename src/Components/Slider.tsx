import styled from "styled-components";

/* Routing */
import { useMatch, useNavigate } from "react-router-dom";

/* Data fetching */
import { IMovie } from "../api";
import { makeImgPath } from "../utils";

/* Motion */
import { motion, AnimatePresence } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";
import { useState } from "react";

/* Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCirclePlay,
  faCirclePlus,
  faHeart,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

/* Components Styling */

// Slider Styling
const Title = styled.h3`
  margin-bottom: 1vw;
  padding: 0 60px;
  font-size: 1.4vw;
`;

const SlideWrapper = styled.div`
  position: relative; // To position Row
  width: 100%;
  height: 15vw; // px 단위로 하면 모바일에서 간격이 너무 벌어짐
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
  padding-top: 56.25%; // 16:9 ratio
  border-radius: 0.2vw;
  background-image: url(${(props) => props.bg});
  background-size: contain; // Preserve aspect-ratio
  background-repeat: no-repeat;
  overflow: hidden;
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
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween", // default
    },
  },
};

const Arrow = styled.div`
  display: flex;
  justify-content: center; // horizontally
  align-items: flex-start; // vertically
  position: absolute; // To position arrow-icon
  top: 3.5vw; // SlideWrapper's heigt : 15vw
  width: 60px; // parent(Row)'s padding-lr 60px
  font-size: 2vw;
  z-index: 1;
  cursor: pointer;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  &:hover {
    opacity: 1;
    scale: 1.2;
  }
`;

const RightArrow = styled(Arrow)`
  right: 0;
`;

const BoxInfo = styled(motion.div)`
  width: 100%;
  padding: 5%;
  border-bottom-left-radius: 0.2vw;
  border-bottom-right-radius: 0.2vw;
  background-color: ${(props) => props.theme.black.lighter};
  word-wrap: break-word;
  word-break: keep-all;
  opacity: 0;
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
    align-items: center;
    flex-wrap: wrap;
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
      duaration: 0.3,
      type: "tween", // default
    },
  },
};

// Modal Styling
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  // CSS trick to align center
  // top, bottom, left, right 0, margin auto
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 90%;
  max-width: 900px;
  height: fit-content;
  border-radius: 0.5vw;
  background-color: black;
  overflow: hidden;
  z-index: 9999;
`;

const BigMovieWrapper = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BigCover = styled.div<{ bg: string }>`
  position: relative; // To position closeBtn, BigPoster, BigCoverInfo
  width: 100%;
  padding-top: 56.25%;
  background-image: linear-gradient(transparent, black), url(${(props) => props.bg});
  background-size: cover; // Fill the entire background without gaps
  background-position: center top;
  .closeBtn {
    position: absolute;
    top: 5%;
    right: 5%;
    font-size: 32px;
    cursor: pointer;
  }
`;

const BigPoster = styled.div<{ bg: string }>`
  position: absolute;
  bottom: 5%;
  right: 5%;
  width: 120px;
  height: 180px;
  border-radius: 10px;
  background-image: url(${(props) => props.bg});
  background-size: contain; // Preserve aspect-ratio
  background-repeat: no-repeat;
  box-shadow: 6px 5px 29px 10px #000000;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  transform-origin: right bottom;
  &:hover {
    scale: 2;
  }
`;

const BigCoverInfo = styled.div`
  // Parent of BigTitle, BigCoverSubInfo
  position: absolute;
  bottom: 0%;
  left: 5%;
`;

const BigTitle = styled.h1`
  margin-bottom: 10px;
  font-size: 32px; ;
`;

const BigCoverSubInfo = styled.div`
  // Date, Rating Information
  margin-bottom: 20px;
  font-size: 16px;
  span:first-child {
    margin-right: 10px;
    color: ${(props) => props.theme.green};
  }
`;

const BigContent = styled.div`
  // Overview, Icons
  display: grid;
  grid-template-columns: auto 120px;
  padding: 0 5% 5% 5%;
`;

const BigOverview = styled.p`
  width: 90%;
  word-wrap: break-word;
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
    color: ${(props) => props.theme.white.darker};
    transition: all 0.2s ease-in-out;
  }
  .play:hover,
  .plus:hover {
    scale: 1.2;
    color: white;
  }
`;

interface ISliderProps {
  movies?: IMovie[];
  title: string;
  category: string;
}

function Slider({ movies, title, category }: ISliderProps) {
  // Window-width
  const width = useWindowDimensions();

  // Slide Movement
  const [movingNext, setMovingNext] = useState(false);

  const offset = 6;
  const [index, setIndex] = useState(0);
  const totalMovies = movies?.length! - 1;
  const maxIndex = Math.floor(totalMovies / offset) - 1;

  const increaseIndex = () => {
    if (movies) {
      if (movingNext) return;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setMovingNext(true);
    }
  };
  const onExitToggleMoving = () => {
    setMovingNext((prev) => !prev);
  };

  // Modal
  const navigate = useNavigate();
  const onBoxClicked = (movieId: number) => {
    if (category === "영화") {
      navigate(`/movies/${movieId}`);
    } else {
      navigate(`/tv/${movieId}`);
    }
  };
  const onOverlayClicked = () => navigate(-1);
  const onCloseBtnClicked = () => navigate(-1);

  const bigMovieMatch = useMatch(category === "영화" ? "/movies/:movieId" : "/tv/:movieId");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movies?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  return (
    <>
      <Title>{title}</Title>

      <SlideWrapper>
        <AnimatePresence initial={false} onExitComplete={onExitToggleMoving}>
          <Row
            key={index}
            initial={{ x: width - 130 }}
            animate={{ x: 0 }}
            exit={{ x: -width + 60 }}
            transition={{ type: "tween", duration: 0.7 }}
          >
            {movies
              ?.slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={movie.id}
                  bg={makeImgPath(movie.backdrop_path, "w500")}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <BoxInfo variants={infoVariants}>
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
                  </BoxInfo>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightArrow onClick={increaseIndex}>
          <FontAwesomeIcon icon={faAngleRight} />
        </RightArrow>
      </SlideWrapper>

      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie>
              <BigMovieWrapper>
                {clickedMovie && (
                  <>
                    <BigCover bg={makeImgPath(clickedMovie.backdrop_path, "w500")}>
                      <BigPoster bg={makeImgPath(clickedMovie.poster_path, "w500")} />
                      <BigCoverInfo>
                        <BigTitle>
                          {category === "영화" ? clickedMovie.title : clickedMovie.name}
                        </BigTitle>
                        <BigCoverSubInfo>
                          <span>
                            첫방영 :{" "}
                            {category === "영화"
                              ? clickedMovie.release_date
                              : clickedMovie.first_air_date}
                          </span>
                          <span>평점 : ⭐{clickedMovie.vote_average} 점</span>
                        </BigCoverSubInfo>
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
              </BigMovieWrapper>
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Slider;
