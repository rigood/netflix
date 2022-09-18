import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";

import { IMovie } from "../api";
import { makeImgPath } from "../utils";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBackspace } from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "./useWindowDimensions";

interface ISliderProps {
  movies?: IMovie[];
  title: string;
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
  height: 11vw;
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
`;

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

const offset = 6;

function Slider({ movies, title }: ISliderProps) {
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
                ></Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightArrow onClick={increaseIndex}>
          <FontAwesomeIcon icon={faAngleRight} />
        </RightArrow>
      </Wrapper>
    </>
  );
}

export default Slider;
