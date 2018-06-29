import * as React from 'react';
import {connect} from 'react-redux';
import {store} from "../store";
import {Chessground} from 'chessground';

const throttle = require('lodash/throttle');

import * as Chess from 'chess.js';

import {
    IOnMove,
    setHowIsOnMove,
    setMove, setPosition,
    setStatus
} from "../actions";

import {Api} from "chessground/api";
import {
    getHistoryMove, toColor,
    toDests
} from "../libs/chessboardUtils";
import guid from "../libs/uuid";
import {ApiManagerService} from "../services/apiManager";
import {OnMoveIndication} from "./onMoveIndication";


@connect((state) => ({
    fen: state.fen,
    onMove: state.onMove,
    history: state.history,
    isFlip: state.isFlip,
    lastMoveId: state.lastMoveId
}))
export class SmartAwesomeChessboard extends React.Component<any, any> {

    private board: any = null;
    static FIRST_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    constructor(props: IChessboardProps) {

        super(props);

        this.state = {
            fen: SmartAwesomeChessboard.FIRST_POSITION,
            orientation: 'white',
            evaluation: {}
        };
    }


    render() {
        return (
            <div className="brown pos-r">
                <OnMoveIndication onMove={this.props.onMove} isFlip={this.props.isFlip}/>

                <div id="awesome-chessboard" className="is2d"/>

                <div className="fen">
                    FEN: <input className="form-control form-control-sm" value={this.props.fen}/>
                </div>
            </div>
        );
    }

    handleFenChange = (e: any) => {
        console.log('handleFenChange');
        store.dispatch(setPosition(e.target.value));
    }

    componentWillReceiveProps(nextProps: IChessboardProps) {
        if (nextProps.isFlip !== this.props.isFlip) {
            this.board.set({
                orientation: nextProps.isFlip ? 'black' : 'white'
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
        const moveColor = chess.turn() === 'b' ? 'Black' : 'White';

        status = '';
        // checkmate?
        if (chess.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        } else if (chess.in_draw() === true) { // draw?
            status = 'Game over, drawn position';
        } else { // game still on
            // status = moveColor + ' to move';
            // check?
            if (chess.in_check() === true) {
                status += moveColor + ' is in check';
            }
        }

        store.dispatch(setStatus(status));
        store.dispatch(setHowIsOnMove(chess.turn() === 'b' ? IOnMove.BLACK : IOnMove.WHITE));
    }

    private playOtherSide(cg: Api) {
        return (orig, dest) => {

            const uuid = guid();

            store.dispatch(setMove(orig, dest, uuid));

        };
    }

    registerSavingHistory() {
        // auto saving for history
        let previousLength: number = 0;

        const saveHistory = throttle(() => {
            const history = store.getState()['history'];
            const user = store.getState()['user'];
            ApiManagerService.saveGame(history, user);
        }, 1000);

        function handleHistoryChange() {

            let currentLength = Object.keys(store.getState()['history']).length;

            if (previousLength !== currentLength) {
                saveHistory();
            }
            previousLength = currentLength;
        }

        store.subscribe(handleHistoryChange);
    }

    componentDidMount() {
        const el: any = document.getElementById('awesome-chessboard');
        this.board = Chessground(el, {
            orientation: 'white',
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

        this.registerSavingHistory();
    }


}

export interface IHistoryMove {
    uuid: string;
    parentId: string | null;
    fen: string;
    notation: string;
    shortNotation: string;
    isMain: boolean;
}

interface IChessboardProps {
    fen: string;
    history: IHistoryMove[];
    isFlip: boolean;
    lastMoveId: string;
}
