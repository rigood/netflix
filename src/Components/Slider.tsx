import styled from "styled-components";

/* Routing */
import { useMatch, useNavigate } from "react-router-dom";

/* Data fetching */
import { useQuery } from "@tanstack/react-query";
import { getCreditsMovie, getCreditsTv, getDetailMovie, getDetailTv, IGetCreditsResult, IGetDetailResult, IMovie } from "../api";
import { makeImgPath } from "../utils";

/* Motion */
import { motion, AnimatePresence, useScroll } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";
import { useEffect, useState } from "react";

/* Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faCirclePlay, faCirclePlus, faHeart, faClose } from "@fortawesome/free-solid-svg-icons";

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

const Handle = styled.div`
  display: flex;
  justify-content: center; // horizontally
  align-items: flex-start; // vertically
  position: absolute; // To position Handle-icon
  top: 3.5vw; // SlideWrapper's heigt : 15vw
  z-index: 1;
  width: 60px; // parent(Row)'s padding-lr 60px
  font-size: 2vw;
  cursor: pointer;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  &:hover {
    opacity: 1;
    scale: 1.2;
  }
`;

const LeftHandle = styled(Handle)`
  left: 0;
`;

const RightHandle = styled(Handle)`
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
  opacity: 0; // for animation 0->1->0
`;

const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 9999; // On top of Overlay
  width: 90%;
  max-width: 900px;
  height: fit-content;
  border-radius: 0.5vw;
  background-color: black;
  overflow: hidden;
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
    top: 7%;
    right: 7%;
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
  // Parent of BigCoverGenres, BigCoverNumber, BigTitle, BigCoverSubInfo
  position: absolute;
  bottom: 0%;
  left: 5%;
`;

const BigCoverGenres = styled.div`
  margin-bottom: 10px;
  span {
    margin-right: 10px;
    padding: 2px 4px;
    border-radius: 6px;
    background-color: ${(props) => props.theme.red};
    font-size: 14px;
    font-weight: 400;
  }
`;

const BigCoverNumber = styled.div`
  margin-bottom: 10px;
  span {
    font-size: 14px;
    font-weight: 400;
  }
`;

const BigTitle = styled.h1`
  margin-bottom: 10px;
  font-size: 32px; ;
`;

const BigCoverSubInfo = styled.div`
  // Date, Rating Information
  margin-bottom: 20px;
  font-size: 16px;
  span:not(last-child) {
    margin-right: 10px;
  }
  span:first-child {
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

const BigCast = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  width: 100%;
  padding: 0% 5% 5% 5%;
  text-align: center;
  .name {
    font-size: 14px;
  }
  .character {
    font-size: 12px;
    font-weight: 300;
    font-style: italic;
  }
`;

const BigCastImg = styled.div<{ bg: string }>`
  width: 100%;
  height: 200px;
  margin-bottom: 15px;
  border-radius: 5px;
  background-image: url(${(props) => props.bg});
  background-size: cover;
`;

interface ISliderProps {
  movies?: IMovie[];
  title: string;
  category: string;
  section: string;
}

interface IRowVariantsProps {
  movingBack: boolean;
  width: number;
}

const rowVariants = {
  enter: ({ movingBack, width }: IRowVariantsProps) => ({
    x: movingBack ? -width + 10 : width - 120,
  }),
  visible: {
    x: 0,
  },
  exit: ({ movingBack, width }: IRowVariantsProps) => ({
    x: movingBack ? width - 120 : -width + 10,
  }),
};

// console.log(scrollY);

function Slider({ movies, title, category, section }: ISliderProps) {
  // Window-width
  const width = useWindowDimensions();

  // Slide Movement
  const [leaving, setLeaving] = useState(false);
  const [movingBack, setMovingBack] = useState(false);

  const offset = 6;
  const [index, setIndex] = useState(0);
  const totalMovies = movies?.length! - 1;
  const maxIndex = Math.floor(totalMovies / offset) - 1;

  const increaseIndex = () => {
    if (movies) {
      if (leaving) return;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setLeaving(true);
    }
  };

  const decreaseIndex = () => {
    if (movies) {
      if (leaving) return;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setLeaving(true);
      setMovingBack(true);
    }
  };

  const onExitToggleMoving = () => {
    setMovingBack(false);
    setLeaving((prev) => !prev);
  };

  // Modal
  const navigate = useNavigate();
  const onBoxClicked = (section: string, movieId: number) => {
    if (category === "영화") {
      navigate(`/movies/${section}/${movieId}`);
    } else {
      navigate(`/tv/${section}/${movieId}`);
    }
  };
  const onOverlayClicked = () => {
    if (category === "영화") {
      navigate("/");
    } else {
      navigate("/tv");
    }
  };
  const onCloseBtnClicked = () => {
    if (category === "영화") {
      navigate("/");
    } else {
      navigate("/tv");
    }
  };

  const bigMovieMatch = useMatch(category === "영화" ? `/movies/${section}/:movieId` : `/tv/${section}/:movieId`);

  const clickedMovie = bigMovieMatch?.params.movieId && movies?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  // Data-fetching for detail movie data in Modal
  const detailId = bigMovieMatch?.params.movieId;
  const { data: detailMovieData } = useQuery<IGetDetailResult>(["detailMovie", detailId], () => getDetailMovie(detailId || ""), {
    enabled: !!detailId,
  });
  const { data: detailTvData } = useQuery<IGetDetailResult>(["detailTv", detailId], () => getDetailTv(detailId || ""), {
    enabled: !!detailId,
  });
  const { data: castMovieData } = useQuery<IGetCreditsResult>(["castMovie", detailId], () => getCreditsMovie(detailId || ""), {
    enabled: !!detailId,
  });
  const { data: castTvData } = useQuery<IGetCreditsResult>(["castTv", detailId], () => getCreditsTv(detailId || ""), {
    enabled: !!detailId,
  });

  // Positioning BigMovie Modal
  const { scrollY } = useScroll();

  useEffect(() => {
    scrollY.onChange(() => console.log(scrollY.get()));
  }, [scrollY]);

  return (
    <>
      <Title>{title}</Title>

      <SlideWrapper>
        <LeftHandle onClick={decreaseIndex}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </LeftHandle>
        <AnimatePresence initial={false} onExitComplete={onExitToggleMoving} custom={{ movingBack, width }}>
          <Row key={index} variants={rowVariants} initial="enter" animate="visible" exit="exit" custom={{ movingBack, width }} transition={{ type: "tween", duration: 0.5 }}>
            {movies
              ?.slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={`${String(movie.id)}${section}`}
                  key={movie.id}
                  bg={makeImgPath(movie.backdrop_path, "w500")}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  onClick={() => onBoxClicked(section, movie.id)}
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
                      <span>{category === "영화" ? `개봉일 : ${movie.release_date}` : `첫방영 : ${movie.first_air_date}`}</span>
                      <span>평점 : ⭐{movie.vote_average} 점</span>
                    </div>
                  </BoxInfo>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightHandle onClick={increaseIndex}>
          <FontAwesomeIcon icon={faAngleRight} />
        </RightHandle>
      </SlideWrapper>

      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay onClick={onOverlayClicked} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie layoutId={`${bigMovieMatch.params.movieId}${section}`} scrolly={scrollY.get()}>
              {clickedMovie && (
                <>
                  <BigCover bg={makeImgPath(clickedMovie.backdrop_path, "w500")}>
                    <BigPoster bg={makeImgPath(clickedMovie.poster_path, "w500")} />
                    <BigCoverInfo>
                      <BigCoverGenres>
                        {category === "영화"
                          ? detailMovieData?.genres.map((genre) => {
                              return <span key={genre.id}>{genre.name}</span>;
                            })
                          : detailTvData?.genres.map((genre) => {
                              return <span key={genre.id}>{genre.name}</span>;
                            })}
                      </BigCoverGenres>
                      <BigCoverNumber>
                        <span>{category === "영화" ? `상영시간 : ${detailMovieData?.runtime}분` : `시즌 ${detailTvData?.number_of_seasons}개 에피소드 ${detailTvData?.number_of_episodes}개`}</span>
                      </BigCoverNumber>
                      <BigTitle>{category === "영화" ? clickedMovie.title : clickedMovie.name}</BigTitle>
                      <BigCoverSubInfo>
                        <span>{category === "영화" ? `개봉일 : ${clickedMovie.release_date}` : `첫방영 : ${clickedMovie.first_air_date}`}</span>
                        <span>평점 : ⭐{clickedMovie.vote_average} 점</span>
                      </BigCoverSubInfo>
                    </BigCoverInfo>
                    <FontAwesomeIcon className="closeBtn" icon={faClose} onClick={onCloseBtnClicked} />
                  </BigCover>

                  <BigContent>
                    <BigOverview>{clickedMovie.overview ? clickedMovie.overview : "준비중입니다."}</BigOverview>
                    <BigIcons>
                      <FontAwesomeIcon icon={faCirclePlay} className="play" bounce />
                      <FontAwesomeIcon icon={faCirclePlus} className="plus" />
                    </BigIcons>
                  </BigContent>
                  <BigCast>
                    {category === "영화"
                      ? castMovieData?.cast.slice(0, 5).map((actor, index) => {
                          return (
                            <div key={index}>
                              <BigCastImg bg={makeImgPath(actor.profile_path, "w200")} />
                              <div className="name">{actor.name}</div>
                              <div className="character">{actor.character}</div>
                            </div>
                          );
                        })
                      : castTvData?.cast.slice(0, 5).map((actor, index) => {
                          return (
                            <div key={index}>
                              <BigCastImg bg={makeImgPath(actor.profile_path, "w200")} />
                              <div className="name">{actor.name}</div>
                              <div className="character">{actor.character}</div>
                            </div>
                          );
                        })}
                  </BigCast>
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
