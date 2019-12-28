import * as React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {Chessground} from "chessground";
import * as Chess from "chess.js";

import {IOnMove, setStatus, setWhoIsOnMove} from "../../actions";

import {Api} from "chessground/api";
import {toColor, toDests} from "../../libs/chessboardUtils";
import {ApiManagerService} from "../../services/apiManager";
import {OnMoveIndication} from "./onMoveIndication";
import {PromotingDialog} from "./promotingDialog";
import {IHistoryMove, setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import {AutoplayService} from "../../libs/autoplayEngine";
import {setPromotionDialog} from "./promotingDialogReducers";
import {Log} from "../../libs/logger";
import {SessionManagerService} from "../../services/sessionManager";
import {ILastMove, IUser} from "../../reducers";

const throttle = require("lodash/throttle");
const debounce = require("lodash/debounce");

// @connect((state):any => ({
//     fen: state.fen,
//     onMove: state.onMove,
//     history: state.history,
//     isFlip: state.isFlip,
//     lastMoveId: state.lastMoveId,
//     lastMove: state.lastMove,
//     promotionDialog: state.promotionDialog,
//     evaluation: state.evaluation,
// }))
export class SmartAwesomeChessboard2 extends React.Component<any, any> {

    private board: any = null;
    static FIRST_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    constructor(props: IChessboardProps) {

        super(props);

        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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

            </div>
        );
    }

    handlePromotePiece = (e: any) => {
        e.preventDefault();
        const propsSetMove:any = {...store.getState()["promotionDialog"]["requestedParams"]};
        propsSetMove.promotion = e.currentTarget.dataset.piece;
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
            console.log("nextProps", nextProps);
            const chess = new Chess(nextProps.fen);
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
                fen: nextProps.fen,
            };

            if (nextProps.lastMove.from && nextProps.lastMove.to) {
                options.lastMove = [nextProps.lastMove.from, nextProps.lastMove.to];
            }
            this.board.set(options);
            this.board.redrawAll();
            this.updateStatus(chess);
        }


        if (nextProps.evaluation.length > 0) {

            const move = nextProps.evaluation[0].p;
            const from = move.substring(0, 2);
            const to = move.substring(2, 4);

            this.board.setShapes([{
                orig: from,
                dest: to,
                brush: "paleGreen"
            }])
        }
    }


    private updateStatus(chess) {
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

    private playOtherSide(cg: Api) {
        return (orig, dest) => {
            console.log("playOtherSide");
            store.dispatch(setMove({
                from: orig,
                to: dest,
                id: treeService.getCounter(),
                fen: (cg.state as any).fen
            }));
        };
    }

    initHistorySaving() {
        // auto saving for history
        let previousHash: string = treeService.getStateHash();

        const saveHistory = throttle(() => {
            const state = store.getState();
            const history = state["history"];
            const user: IUser = state["user"];
            const token = SessionManagerService.getToken();
            if (user.lastGameId) {
                ApiManagerService.saveGame(history, user.lastGameId, token);
            }
        }, 1000);

        function handleHistoryChange() {

            let currentHash = treeService.getStateHash();

            if (previousHash !== currentHash) {
                saveHistory();
            }
            previousHash = currentHash;
        }

        store.subscribe(handleHistoryChange);
    }

    componentDidMount() {
        const el: any = document.getElementById("awesome-chessboard");
        this.board = Chessground(el, {
            orientation: "white",
            highlight: {
                check: true,
                lastMove: true
            },
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
        Log.info("before -> AutoplayService", store);

        this.initializeResizeListener();

        new AutoplayService();
    }

    onResize = debounce(() => {
        this.board.redrawAll();
        console.log("redraw");
    }, 100)

    initializeResizeListener() {

        window.addEventListener("resize", this.onResize, true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize, true);
    }


}


interface IChessboardProps {
    fen: string;
    history: IHistoryMove[];
    isFlip: boolean;
    lastMoveId: string;
    lastMove: ILastMove;
    evaluation: {
        p: string
    }[]
}
