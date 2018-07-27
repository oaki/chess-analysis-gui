import * as React from "react";
import {connect} from "react-redux";
import * as Chess from "chess.js";
import {getLastMove} from "../../libs/chessboardUtils";
import {
    ISetMoveProps,
    SET_HISTORY,
    SET_HISTORY_MOVE,
    SET_LAST_MOVE,
    setEvaluation,
    setOpeningPosition,
    setPosition
} from "../../actions";
import {store} from "../../store";
import {batchActions} from "redux-batched-actions";
import {setSyzygyEvaluation} from "../syzygyExplorer";
import {IAction} from "../../interfaces";
import {isPromoting, setPromotionDialog} from "../chessboard/promotingDialog";
import {Node, NODE_MAP, treeService} from "../moveTree/tree";
import {IMoves, Moves} from "./moves";

const classNames = require("classnames");

interface IHistoryProps {
    history: string[];
    lastMoveId: string;
}


export interface IHistoryMove {
    id: number;
    parentId: number;
    fen: string;
    notation: string;
    shortNotation: string;
}

@connect((state) => ({
    history: state.history,
    lastMoveId: state.lastMoveId,
}))
export class History extends React.Component<any, any> {


    handleMoveClick(e) {
        e.preventDefault();
        const id: number = Number(e.currentTarget.dataset.id);

        const ref = treeService.getReference(id);

        if (ref && ref.node) {
            store.dispatch(batchActions([
                lastMoveId(ref.node[NODE_MAP.id]),
                setPosition(ref.node[NODE_MAP.fen]),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([])
            ]));
        }
    }

    prepareMovesProps(): IMoves {
        return {
            moves: this.props.history,
            counter: 0,
            level: 0,
            lastMoveId: this.props.lastMoveId,
            handleMoveClick: this.handleMoveClick,
            showBracket: false
        }
    }

    render() {

        return (
            <div className="history">

                <div className="history__slider">
                    <div className="history__slider__holder">
                        <Moves {...this.prepareMovesProps()}/>
                    </div>
                </div>
            </div>
        )
    }


}


export const historyReducer = (state: Node[] = [], action: IAction<IHistoryMove | any>) => {
    switch (action.type) {
        case SET_HISTORY_MOVE:
            return treeService.toJson();

        case SET_HISTORY:
            treeService.setNodes(action.payload);
            return action.payload;

        default:
            return state;
    }
};


export function setMove(props: ISetMoveProps) {

    const {from, to, promotion, id, fen} = props;

    const chess = new Chess(fen);

    if (!promotion && isPromoting(from, to, chess)) {
        console.log("setPromotionDialog", from, to);
        return store.dispatch(
            setPromotionDialog({
                requestedParams: props,
                isOpen: true,
            })
        );


    } else {
        const newMove: any = chess.move({from, to, promotion});
        const newFen: string = chess.fen();
        const previousId = getLastMove();

        //check if FEN is not exist already like next move
        const nextMoveId = treeService.getNextMoveId(previousId, newFen);

        const actions: any = [
            setOpeningPosition([]),
            setEvaluation([]),
            setPosition(newFen),
            setSyzygyEvaluation(null)
        ];

        if (nextMoveId ) {
            actions.push(lastMoveId(nextMoveId));
        } else {
            actions.push(lastMoveId(id));

            if(!newMove.san){
                debugger;
            }
            actions.push(
                setHistoryMove({
                    id,
                    parentId: previousId,
                    fen: newFen,
                    notation: `${from}${to}`,
                    shortNotation: `${newMove.san}`,
                }),
            );
        }

        return batchActions(actions);
    }
}

export function setHistoryMove(payload: IHistoryMove) {
    treeService.add({
        [NODE_MAP.id]: payload.id,
        [NODE_MAP.fen]: payload.fen,
        [NODE_MAP.move]: payload.notation,
        [NODE_MAP.shortNotation]: payload.shortNotation,
        [NODE_MAP.variants]: []
    }, payload.parentId);

    console.log({treeService});

    return {
        payload,
        type: SET_HISTORY_MOVE
    };
}

export function setHistory(payload: any) {
    return {
        payload,
        type: SET_HISTORY
    };
}

export function lastMoveId(id: number | null) {
    return {
        id,
        type: SET_LAST_MOVE
    };
}