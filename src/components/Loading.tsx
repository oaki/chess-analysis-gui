import React, { memo } from "react";
import styled from "@emotion/styled";

interface ILoadingProps {
  isLoading: boolean;
}

export const Loading = memo((props: ILoadingProps) => {
  if (props.isLoading) {
    return (
      <div className="full-loading">
        <div className="full-loading__img">
          <img src="/img/chess-analysis-logo.svg" alt="chess-analysis-logo.svg" />
        </div>
      </div>
    );
  }
  return null;
});

export const SmallLoading = memo((props: ILoadingProps) => {
  if (props.isLoading) {
    return (
      <StyledLoader>
        <svg className="circular" viewBox="25 25 50 50">
          <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2"
                  strokeMiterlimit="10" />
        </svg>
      </StyledLoader>
    );
  }
  return null;
});

const StyledLoader = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 auto;
  width: 1.5rem;

    :before {
      content: '';
      display: block;
      padding-top: 100%;
    }

.circular {
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  height: 100%;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@-webkit-keyframes 
rotate {  100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
}
}

@keyframes 
rotate {  100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
}
}

@-webkit-keyframes 
dash {  0% {
 stroke-dasharray: 1, 200;
 stroke-dashoffset: 0;
}
 50% {
 stroke-dasharray: 89, 200;
 stroke-dashoffset: -35;
}
 100% {
 stroke-dasharray: 89, 200;
 stroke-dashoffset: -124;
}
}

@keyframes 
dash {  0% {
 stroke-dasharray: 1, 200;
 stroke-dashoffset: 0;
}
 50% {
 stroke-dasharray: 89, 200;
 stroke-dashoffset: -35;
}
 100% {
 stroke-dasharray: 89, 200;
 stroke-dashoffset: -124;
}
}

@-webkit-keyframes 
color {  100%, 0% {
 stroke: #d62d20;
}
 40% {
 stroke: #0057e7;
}
 66% {
 stroke: #008744;
}
 80%, 90% {
 stroke: #ffa700;
}
}

@keyframes 
color {  100%, 0% {
 stroke: #d62d20;
}
 40% {
 stroke: #0057e7;
}
 66% {
 stroke: #008744;
}
 80%, 90% {
 stroke: #ffa700;
}
}
`;