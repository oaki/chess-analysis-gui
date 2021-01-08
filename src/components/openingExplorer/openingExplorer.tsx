import React, { memo, useCallback } from "react";
import { shallowEqual, useSelector } from "react-redux";
import store from "../../store";
import { setMove } from "../history/historyReducers";
import { treeService } from "../moveTree/tree";
import "../../assets/css/explorerBox.css";
import { IOpeningMove } from "./openingExplorerReducers";
import styled from "@emotion/styled";
import { IState } from "interfaces";

export const TableTr = function({ handleMove, moves }) {

  const handleClick = (e) => {
    e.preventDefault();
    handleMove(e.currentTarget.dataset.move);
  };

  return moves.map((item: IOpeningMove, index) => {
    return (
      <tr key={index} onClick={handleClick} data-move={item.move}>
        <td>
          {item.san}
        </td>
        <td>{item.weight}</td>
      </tr>
    );
  });
};

export type TableTrProps = {
  moves: IOpeningMove[];
  handleMove: (move: string, fen: string) => void;
}

const StyledExplorerBox = styled.div`
  flex-grow: 1;

  overflow: auto;

  /* for Firefox */
  min-height: 10rem;
`;

const StyledTable = styled.table`
  width: 100%;
  background: #262626;
  color: #b3b3b3;
  font-size: 1.2rem;

  thead th {
    background: #262626;
    font-weight: 500;
  }

  tbody td,
  thead th {
    padding: .2rem .5rem;
  }

  tbody tr {
    background: #363636;
    cursor: pointer;
  }

  tbody tr:nth-of-type(odd) {
    background: #4b4b4b;
  }

  tbody tr:hover {
    background: #7c7c7c;
  }
`;
const OpeningExplorer = memo(() => {

  const moves = useSelector((state: IState) => state.openingMoves, shallowEqual);
  const fen = useSelector((state: IState) => state.fen, shallowEqual);

  const handleMove = useCallback((move) => {
    store.dispatch(setMove({
      from: move.substring(0, 2),
      to: move.substring(2, 4),
      id: treeService.getCounter(),
      fen
    }));
    return;
  }, [fen]);

  if (moves.length === 0) {
    return null;
  }
  return (
    <StyledExplorerBox>
      <StyledTable>
        <thead>
        <tr>
          <th>Move</th>
          <th>Weight</th>
        </tr>
        </thead>
        <tbody>
        <TableTr moves={moves} handleMove={handleMove} />
        </tbody>
      </StyledTable>
    </StyledExplorerBox>
  );
});

export const SmartOpeningExplorer = OpeningExplorer;
