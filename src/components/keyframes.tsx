import { keyframes } from "styled-components";

export const shakeLeft = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  20% {
    transform: translate3d(-5px, 0, 0);
  }
  40% {
    transform: translate3d(-2px, 0, 0);
  }
  60% {
    transform: translate3d(-4px, 0, 0);
  }
  80% {
    transform: translate3d(-1px, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

export const shakeRight = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  20% {
    transform: translate3d(5px, 0, 0);
  }
  40% {
    transform: translate3d(2px, 0, 0);
  }
  60% {
    transform: translate3d(4px, 0, 0);
  }
  80% {
    transform: translate3d(1px, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

export const shakeDown = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  20% {
    transform: translate3d(0, 5px, 0);
  }
  40% {
    transform: translate3d(0, 2px, 0);
  }
  60% {
    transform: translate3d(0, 4px, 0);
  }
  80% {
    transform: translate3d(0, 1px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;
