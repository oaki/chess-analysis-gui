import React, { ReactNode } from "react";
import { ISwipeableListProps, SwipeableList } from "@sandstreamdev/react-swipeable-list";
import styled from "@emotion/styled";

export const StyledList = styled.div`
  .SwipeableList_swipeableList__1FACG {
    flex: 1;
    background: red;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .SwipeableListItem_swipeableListItem__3Tgya {
    position: relative;
    transition: max-height 0.5s ease;
    max-height: 1000px;
    transform-origin: top;
    overflow: hidden;
    width: 100%;
    z-index: 0;
  }

  .SwipeableListItem_contentRight__doq05 {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    opacity: 0;
  }

  .SwipeableListItem_contentLeft__2yNci {
    justify-content: flex-end;
  }

  .SwipeableListItem_return__25gWI {
    transition: opacity 0.5s ease-out;
  }

  .SwipeableListItem_contentLeftReturn___PqJ1 {
  }

  .SwipeableListItem_contentRightReturn__3jXBY {
  }

  .SwipeableListItem_content__3wbMa {
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    background-color: #353535;
    height: 100%;
  }

  .SwipeableListItem_contentReturn__Kx-Al {
    transition: transform 0.5s ease-out;
  }
`;

export const List = (props: { children: ReactNode} ) => {
  return (
    <StyledList>
      <SwipeableList>{props.children}</SwipeableList>
    </StyledList>
  );
};