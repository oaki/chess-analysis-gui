import React, { memo, useEffect } from "react";
import type { MouseEvent } from "react";
import type { Api } from "chessground/api";
import { shallowEqual, useSelector } from "../../libs/stateCompat";
import { store } from "../../store";
import { Chess } from "chess.js";
import { toColor, toDests } from "../../libs/chessboardUtils";
import { OnMoveIndication } from "./onMoveIndication";
import { PromotingDialog } from "./promotingDialog";
import { ISetMoveProps, IOnMove, setStatus, setWhoIsOnMove } from "../../actions";
import { setMove } from "../history/historyReducers";
import { setPromotionDialog } from "./promotingDialogReducers";
import { useBoard } from "./board";
import { ReduxStateShape } from "../../reducers";
import { Key } from "chessground/types";

type ChessgroundSetConfig = Parameters<Api["set"]>[0];

const handlePromotePiece = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const promotionDialog = (store.getState() as ReduxStateShape).promotionDialog as { requestedParams?: ISetMoveProps };
  const requested = promotionDialog.requestedParams;
  if (!requested) {
    return;
  }
  const promotion = e.currentTarget.dataset.piece;
  if (!promotion) {
    return;
  }
  const propsSetMove: ISetMoveProps = { ...requested, promotion };
  store.dispatch(setPromotionDialog({ isOpen: false }));
  store.dispatch(setMove(propsSetMove));
};

function updateStatus(chess: InstanceType<typeof Chess>) {
  const moveColor = chess.turn() === "b" ? "Black" : "White";

  let status = "";
  if (chess.isCheckmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  } else if (chess.isDraw()) {
    status = "Game over, drawn position";
  } else {
    if (chess.isCheck()) {
      status += moveColor + " is in check";
    }
  }

  store.dispatch(setStatus(status));
  store.dispatch(setWhoIsOnMove(chess.turn() === "b" ? IOnMove.BLACK : IOnMove.WHITE));
}

const possibleKeys = ["a0", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];

function isBoardKey(key: string): key is Key {
  return possibleKeys.includes(key);
}

export const SmartAwesomeChessboard = memo((props: IChessboardProps) => {
  const reduxState = useSelector((state: ReduxStateShape) => {
    return {
      fen: state.fen,
      onMove: state.onMove,
      history: state.history,
      isFlip: state.isFlip,
      lastMoveId: state.lastMoveId,
      lastMove: state.lastMove,
      promotionDialog: state.promotionDialog,
      evaluation: state.evaluation
    };
  }, shallowEqual) as {
    fen: string;
    onMove: IOnMove;
    history: unknown[];
    isFlip: boolean;
    lastMoveId: number;
    lastMove: { from: string; to: string };
    promotionDialog: { isOpen: boolean; requestedParams?: ISetMoveProps };
    evaluation: Array<{ p?: string }>;
  };
  const { isFlip, fen, lastMove, evaluation, promotionDialog, onMove } = reduxState;
  const { from, to } = lastMove;
  const [setRef, board] = useBoard();
  useEffect(() => {
    if (board) {
      board.set({
        orientation: isFlip ? "black" : "white"
      });
    }
  }, [board, isFlip]);

  useEffect(() => {

    if (board) {
      const chess = new Chess(fen);
      const options = {
        check: chess.isCheck(),
        turnColor: toColor(chess),
        highlight: {
          check: true,
          lastMove: true,
          selected: true
        },
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        },
        fen
      } as ChessgroundSetConfig;

      if (from && to && isBoardKey(from) && isBoardKey(to)) {
        options.lastMove = [from, to];
      }
      board.set(options);
      console.log("board.redrawAll");
      board.redrawAll();
      updateStatus(chess);
    }
  }, [board, fen, from, to]);

  useEffect(() => {
    if (board && evaluation.length > 0) {
      const move = evaluation[0].p;
      if (typeof move === "string") {
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);

        if (isBoardKey(from) && isBoardKey(to)) {
          board.setShapes([{
            orig: from,
            dest: to,
            brush: "paleGreen"
          }]);
        }
      }
    }
  }, [board, evaluation]);


  return (
    <div className="brown pos-r">
      <OnMoveIndication onMove={onMove} isFlip={isFlip} />

      <PromotingDialog
        {...promotionDialog}
        onMove={onMove}
        handleOnClick={handlePromotePiece}
      />

      <div id="awesome-chessboard" className="is2d" ref={setRef} />
    </div>
  );
});


export type IChessboardProps = Record<string, never>
