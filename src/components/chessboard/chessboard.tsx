import * as React from "react";
import {connect} from "react-redux";
import {store} from "../../store";
import {Chessground} from "chessground";
import * as Chess from "chess.js";

import {IOnMove, setMove, setPosition, setStatus, setWhoIsOnMove} from "../../actions";

import {Api} from "chessground/api";
import {getHistoryMove, toColor, toDests} from "../../libs/chessboardUtils";
import guid from "../../libs/uuid";
import {ApiManagerService} from "../../services/apiManager";
import {OnMoveIndication} from "./onMoveIndication";
import {PromotingDialog, setPromotionDialog} from "./promotingDialog";
import {Tree} from "../moveTree/tree";

const throttle = require("lodash/throttle");


@connect((state) => ({
    fen: state.fen,
    onMove: state.onMove,
    history: state.history,
    isFlip: state.isFlip,
    lastMoveId: state.lastMoveId,
    promotionDialog: state.promotionDialog,

}))
export class SmartAwesomeChessboard extends React.Component<any, any> {

    private board: any = null;
    static FIRST_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    constructor(props: IChessboardProps) {

        super(props);

        this.state = {
            fen: SmartAwesomeChessboard.FIRST_POSITION,
            orientation: "white",
            evaluation: {}
        };


    }


    render() {
        return (
            <div className="brown pos-r">
                <OnMoveIndication onMove={this.props.onMove} isFlip={this.props.isFlip}/>

                <PromotingDialog
                    {...this.props.promotionDialog}
                    onMove={this.props.onMove}
                    handleOnClick={this.handlePromotePiece}
                />

                <div id="awesome-chessboard" className="is2d"/>

                <div className="fen">
                    FEN: <input className="form-control form-control-sm" value={this.props.fen}/>
                </div>

                {this.newHistoryStructure()}
            </div>
        );
    }

    handleFenChange = (e: any) => {
        console.log("handleFenChange");
        store.dispatch(setPosition(e.target.value));
    }

    handlePromotePiece = (e: any) => {
        e.preventDefault();
        const promotion: string = e.currentTarget.dataset.piece;
        console.log("handlePromotePiece", e.currentTarget.dataset.piece);

        // store.dispatch(setPosition(e.target.value));
        const propsSetMove = {...store.getState()["promotionDialog"]["requestedParams"]};
        propsSetMove.promotion = promotion;
        console.log("propsSetMove", propsSetMove);
        store.dispatch(setPromotionDialog({isOpen: false}));
        store.dispatch(setMove(propsSetMove));
    }

    componentWillReceiveProps(nextProps: IChessboardProps) {
        if (nextProps.isFlip !== this.props.isFlip) {
            this.board.set({
                orientation: nextProps.isFlip ? "black" : "white"
            });
        }

        if (nextProps.lastMoveId !== this.props.lastMoveId) {
            const move = getHistoryMove(nextProps.lastMoveId);
            if (move) {
                const chess = new Chess(move.fen);
                this.board.set({
                    turnColor: toColor(chess),
                    movable: {
                        color: toColor(chess),
                        dests: toDests(chess)
                    },
                    fen: move.fen
                });
                this.board.redrawAll();
                this.updateStatus(chess);
            } else {
                const chess = new Chess(nextProps.fen);
                this.board.set({
                    turnColor: toColor(chess),
                    movable: {
                        color: toColor(chess),
                        dests: toDests(chess)
                    },
                    fen: nextProps.fen
                });
                this.board.redrawAll();
                this.updateStatus(chess);
            }
        }
    }


    private updateStatus(chess) {
        const moveColor = chess.turn() === "b" ? "Black" : "White";

        status = "";
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

    private playOtherSide(cg: Api) {
        return (orig, dest) => {

            const history = [
                {id: 0, n: 0, m: "d2d4", p: null},
                {id: 1, n: 1, m: "d7d5", p: null},
                {id: 2, n: 2, m: "c2c4", p: null},

                {id: 3, n: 2, m: "g1f3", p: 2},
                {id: 4, n: 2, m: "b1c3", p: 2},

                {id: 5, n: 3, m: "g8f6", p: 2},
                {id: 6, n: 4, m: "c2c4", p: 2},
                {id: 7, n: 5, m: "c7c6", p: 2},

                {id: 8, n: 3, m: "e7e6", p: 2},

                {id: 9, n: 3, m: "g7g6", p: 5},
                {id: 10, n: 4, m: "g2g3", p: 5},
                {id: 11, n: 3, m: "c7c6", p: null},

            ];


            store.dispatch(setMove({
                from: orig,
                to: dest,
                uuid: guid(),
                fen: (cg.state as any).fen
            }));
        };
    }

    doHistory() {

    }

    newHistoryStructure() {
        const tree = new Tree();
        let prevLevel = 0;
        return tree.build().map((node: any, index: number) => {
            const isNextLevel: boolean = prevLevel < node.level;
            const isPrevLevel = prevLevel > node.level;
            prevLevel = node.level;

            const className = "level-" + node.level;
            return (
                <>
                    {isNextLevel && <span>&lt;</span>}

                    {node.isNewVariant && <div key={index} className={className}>{node.move} </div>}
                    {!node.isNewVariant && <span key={index} className={className}>{node.move} </span>}
                    {isPrevLevel && <span>&gt;</span>}
                </>
            )


        });
    }

    initHistorySaving() {
        // auto saving for history
        let previousLength: number = 0;

        const saveHistory = throttle(() => {
            const history = store.getState()["history"];
            const user = store.getState()["user"];
            ApiManagerService.saveGame(history, user);
        }, 1000);

        function handleHistoryChange() {

            let currentLength = Object.keys(store.getState()["history"]).length;

            if (previousLength !== currentLength) {
                saveHistory();
            }
            previousLength = currentLength;
        }

        store.subscribe(handleHistoryChange);
    }

    componentDidMount() {
        const el: any = document.getElementById("awesome-chessboard");
        this.board = Chessground(el, {
            orientation: "white",
            addPieceZIndex: true,
            movable: {
                // color: 'white',
                free: false,
                dests: toDests(new Chess())
            }
        });

        this.board.redrawAll();

        this.board.set({
            movable: {
                events: {
                    after: this.playOtherSide(this.board)
                }
            }
        });

        this.initHistorySaving();
    }


}

export interface IHistoryMove {
    uuid: string;
    parentId: string | null;
    fen: string;
    notation: string;
    shortNotation: string;
}

interface IChessboardProps {
    fen: string;
    history: IHistoryMove[];
    isFlip: boolean;
    lastMoveId: string;
}
