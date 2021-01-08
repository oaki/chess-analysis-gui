import { default as React, memo } from "react";
import { ChevronRight, Delete } from "@emotion-icons/material";
import { formatDate } from "../../tools/formatDate";
import { SwipeableListItem } from "@sandstreamdev/react-swipeable-list";
import { IHistoryGameResponse } from "./historyListReducers";
import { IHistoryMove } from "../history/historyReducers";
import { Move } from "./move";
import styled from "@emotion/styled";

export const ListItem = memo(({ historyGame, handleLoadGame, handleDeleteGame }: ListItemProps) => {
  return (
    <SwipeableListItem
      key={historyGame.id}
      swipeRight={{
        content: <div className={"c-white pl-sm"}><Delete width={16} /> Delete</div>,
        action: () => handleDeleteGame(historyGame.id)
      }}
    >
      <StyledListItem key={historyGame.id}
                      onClick={handleLoadGame}
                      data-id={historyGame.id}>
        <div className="d-b p-sm cur-p">
          <span className="c-white f-r"><ChevronRight width={18} height={18} /></span>

          <div className="fs-xs">{formatDate(historyGame.updated_at)}</div>
          <div className="ox-a fs-xs">
            {historyGame.moves.slice(0, 15).map((move: IHistoryMove, index) => {
              return <Move key={move.id} move={move} index={index} />;
            })}
          </div>
        </div>
      </StyledListItem>

    </SwipeableListItem>
  );
});

const StyledListItem = styled.div`
  border-bottom: 1px solid #464646;
`;

interface ListItemProps {
  historyGame: IHistoryGameResponse;
  handleLoadGame: (e: any) => void;
  handleDeleteGame: (id: number) => void;
}
