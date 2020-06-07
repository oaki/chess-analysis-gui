import {NODE_MAP} from "../moveTree/tree";
import * as React from "react";
import {memo} from "react";
import {IHistoryMove} from "../history/historyReducers";

export const Move = memo(({move, index}: MoveProps) => {
    return (
        <span><MoveNumber index={index}/> {move[NODE_MAP.shortNotation]} </span>
    );
});

export const MoveNumber = memo(({index}: MoveNumberProps) => {
    const tmp = index % 2;

    if (tmp === 1) {
        return null;
    }

    const num = Math.round(index / 2) + 1;
    return (
        <span className="fs-xs">{num}. </span>
    )
});

interface MoveProps {
    move: IHistoryMove;
    index: number;
}

interface MoveNumberProps {
    index: number;
}