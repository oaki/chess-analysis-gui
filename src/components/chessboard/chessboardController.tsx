import * as React from "react";
import {memo, useEffect} from "react";
import {shallowEqual, useSelector} from "react-redux";
import store from "../../store";
import * as Chess from "chess.js";
import {toColor, toDests} from "../../libs/chessboardUtils";
import {OnMoveIndication} from "./onMoveIndication";
import {PromotingDialog} from "./promotingDialog";
import {setMove} from "../history/historyReducers";
import {setPromotionDialog} from "./promotingDialogReducers";
import {IOnMove, setStatus, setWhoIsOnMove} from "../../actions";
import {useBoard} from "./board";
import {useWhyDidYouUpdate} from "../../hooks/useWhyDidYouUpdate";
import {IState} from "../../interfaces";

const handlePromotePiece = (e: any) => {
    e.preventDefault();
    const propsSetMove: any = {...store.getState()["promotionDialog"]["requestedParams"]};
    propsSetMove.promotion = e.currentTarget.dataset.piece;
    store.dispatch(setPromotionDialog({isOpen: false}));
    store.dispatch(setMove(propsSetMove));
};

function updateStatus(chess) {
    const moveColor = chess.turn() === "b" ? "Black" : "White";

    let status = "";
    // checkmate?
    if (chess.in_checkmate() === true) {
        status = "Game over, " + moveColor + " is in checkmate.";
    } else if (chess.in_draw() === true) { // draw?
        status = "Game over, drawn position";
    } else { // game still on
        // status = moveColor + ' to move';
        // check?
        if (chess.in_check() === true) {
            status += moveColor + " is in check";
        }
    }

    store.dispatch(setStatus(status));
    store.dispatch(setWhoIsOnMove(chess.turn() === "b" ? IOnMove.BLACK : IOnMove.WHITE));
}


export const SmartAwesomeChessboard = memo((props: IChessboardProps) => {
    const reduxState = useSelector((state: IState) => {
        return {
            fen: state.fen,
            onMove: state.onMove,
            history: state.history,
            isFlip: state.isFlip,
            lastMoveId: state.lastMoveId,
            lastMove: state.lastMove,
            promotionDialog: state.promotionDialog,
            evaluation: state.evaluation,
        }
    }, shallowEqual);
    const {isFlip, fen, lastMove, evaluation, promotionDialog, onMove} = reduxState;
    const {from, to} = lastMove;
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
            const options: any = {
                check: chess.in_check(),
                turnColor: toColor(chess),
                highlight: {
                    check: true,
                    lastMove: true,
                    selected: true,
                },
                movable: {
                    color: toColor(chess),
                    dests: toDests(chess)
                },
                fen
            };

            if (from && to) {
                options.lastMove = [from, to];
            }
            board.set(options);
            console.log('board.redrawAll');
            board.redrawAll();
            updateStatus(chess);
        }
    }, [board, fen, from, to]);

    useEffect(() => {
        if (board && evaluation.length > 0) {
            const move = evaluation[0].p;
            const from = move.substring(0, 2);
            const to = move.substring(2, 4);

            board.setShapes([{
                orig: from,
                dest: to,
                brush: "paleGreen"
            }])
        }
    }, [board, evaluation])


    return (
        <div className="brown pos-r">
            <OnMoveIndication onMove={onMove} isFlip={isFlip}/>

            <PromotingDialog
                {...promotionDialog}
                onMove={onMove}
                handleOnClick={handlePromotePiece}
            />

            <div id="awesome-chessboard" className="is2d" ref={setRef}/>
        </div>
    );
});


export interface IChessboardProps {

}
