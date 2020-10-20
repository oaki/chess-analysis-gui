import {Node, NODE_MAP, treeService} from "../moveTree/tree";
import {isPromoting} from "../chessboard/promotingDialog";
import {loadOpeningPosition, setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {
    ISetMoveProps,
    REMOVE_GAME_FROM_HISTORY,
    SET_HISTORY,
    SET_HISTORY_MOVE,
    SET_LAST_MOVE,
    SET_LAST_MOVE_ID,
    setEvaluation,
    setPosition
} from "../../actions";
import {batchActions} from "redux-batched-actions";
import store from "../../store";
import {IAction, IEvaluation, LINE_MAP} from "../../interfaces";
import * as Chess from "chess.js";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {setPromotionDialog} from "../chessboard/promotingDialogReducers";
import {emitPosition} from "../../services/sockets/actions";
import {loadGamesFromDatabase} from "../gamesDatabaseExplorer/gamesDatabaseReducers";

const maxBy = require("lodash/maxBy");

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

// find best eval based on nodes count. It's temporary. Maybe in future will find better solution.
export function findBestEvaluation(evaluations: IEvaluation[]) {
    return maxBy(evaluations, (evaluation) => {
        return evaluation[LINE_MAP.nodes]
    });
}

export function setMove(props: ISetMoveProps) {

    const {from, to, promotion, id, fen} = props;

    const reduxState = store.getState();
    const chess = new Chess(fen);

    if (!promotion && isPromoting(from, to, chess)) {
        return store.dispatch(
            setPromotionDialog({
                requestedParams: props,
                isOpen: true,
            })
        );
    } else {
        const newMove: any = chess.move({from, to, promotion});
        const newFen: string = chess.fen();
        const previousId: number = reduxState.lastMoveId;
        //check if FEN is not exist already like next move
        const nextMoveId = treeService.getNextMoveId(previousId, newFen);

        const actions: any = [
            setOpeningPosition([]),
            setEvaluation([]),
            setPosition(newFen),
            setSyzygyEvaluation(null),
            lastMove(from, to)
        ];

        let previousEvaluation = null;
        let evaluation = null;

        if (nextMoveId) {
            const currRef = treeService.getReference(nextMoveId);
            if (currRef && currRef[NODE_MAP.evaluation]) {
                evaluation = findBestEvaluation(currRef[NODE_MAP.evaluation]);
            }

            actions.push(lastMoveId(nextMoveId));
        } else {
            actions.push(lastMoveId(id));
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

        const prevRef = treeService.getReference(previousId);

        if (prevRef && prevRef.node && prevRef.node[NODE_MAP.evaluation] && Array.isArray(prevRef.node[NODE_MAP.evaluation])) {
            previousEvaluation = findBestEvaluation(prevRef.node[NODE_MAP.evaluation] || []);
        }

        // todo check how to write move with promotion
        const move = `${from}${to}`;
        actions.push(emitPosition(newFen, move, previousEvaluation, evaluation));


        store.dispatch(loadOpeningPosition(newFen));
        store.dispatch(loadGamesFromDatabase(newFen));

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

export function deleteHistoryGame(id: number) {
    return {
        id,
        type: REMOVE_GAME_FROM_HISTORY
    };
}

export function lastMoveId(id: number) {
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