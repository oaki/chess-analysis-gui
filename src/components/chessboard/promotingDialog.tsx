import React, { FC, memo } from "react";
import { IOnMove } from "../../actions";
import { IPromotingDialogProps } from "./promotingDialogReducers";

export const PromotingDialog = (props: IPromotingDialogProps) => {
  if (!props.isOpen) {
    return null;
  }

  const onMoveClass = props.onMove === IOnMove.WHITE ? "white" : "black";
  // @ts-ignore
  return (
    <div className="promotion__dialog">
      <div className="promotion__pieces">
        <button onClick={props.handleOnClick} className="promotion__href" data-piece="q">
          <Piece className={`${onMoveClass} queen`} />
        </button>
        <button onClick={props.handleOnClick} className="promotion__href" data-piece="r">
          <Piece className={`${onMoveClass} rook`} />
        </button>
        <button onClick={props.handleOnClick} className="promotion__href" data-piece="b">
          <Piece className={`${onMoveClass} bishop`} />
        </button>
        <button onClick={props.handleOnClick} className="promotion__href" data-piece="n">
          <Piece className={`${onMoveClass} knight`} />
        </button>
      </div>
    </div>
  );
};


export const Piece: FC<PieceProps> = memo(({ className }) => {
  return (
    // @ts-ignore
    <piece className={className} />
  );
});

export type PieceProps = {
  className: string;
}

export function isPromoting(from: string, to: string, chess: any) {
  // is it a promotion?
  const source_rank = from.substring(2, 1);
  const target_rank = to.substring(2, 1);
  const piece = chess.get(from).type;
  return (piece === "p" &&
    ((source_rank === "7" && target_rank === "8") || (source_rank === "2" && target_rank === "1")));
}
