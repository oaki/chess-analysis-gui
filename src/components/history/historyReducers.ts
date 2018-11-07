import {Node, NODE_MAP, treeService} from "../moveTree/tree";
import {isPromoting} from "../chessboard/promotingDialog";
import {setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {
    ISetMoveProps,
    SET_HISTORY,
    SET_HISTORY_MOVE,
    SET_LAST_MOVE,
    SET_LAST_MOVE_ID,
    setEvaluation,
    setPosition
} from "../../actions";
import {batchActions} from "redux-batched-actions";
import store from "../../store";
import {IAction} from "../../interfaces";
import * as Chess from "chess.js";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {setPromotionDialog} from "../chessboard/promotingDialogReducers";


export interface IHistoryMove {
    id: number;
    parentId: number;
    fen: string;
    notation: string;
    shortNotation: string;
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
        const previousId = store.getState()["lastMoveId"];

        //check if FEN is not exist already like next move
        const nextMoveId = treeService.getNextMoveId(previousId, newFen);

        const actions: any = [
            setOpeningPosition([]),
            setEvaluation([]),
            setPosition(newFen),
            setSyzygyEvaluation(null),
            lastMove(from, to)
        ];

        if (nextMoveId) {
            actions.push(lastMoveId(nextMoveId));
        } else {
            actions.push(lastMoveId(id));

            if (!newMove.san) {
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
        type: SET_LAST_MOVE_ID
    };
}

export function lastMove(from: string, to: string) {
    return {
        payload: {
            from,
            to,
        },
        type: SET_LAST_MOVE
    };
}