import * as React from 'react';
import {connect} from 'react-redux';
import {store} from "../store";
import {Chessground} from 'chessground';
import * as Chess from 'chess.js';

import {
    lastMoveId, setHistoryMove, setPosition,
    setStatus
} from "../actions";

import {Api} from "chessground/api";
import {
    getHistory, getHistoryChildren, getHistoryMove, getHistoryParents, getLastMove, toColor,
    toDests
} from "../libs/chessboardUtils";
import guid from "../libs/uuid";
import {ApiManagerService} from "../services/apiManager";


enum Color {
    b = 'black',
    w = 'white',
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


export class AwesomeChessboard extends React.Component<IChessboardProps, any> {

    private board: any = null;
    private chess: any = null;

    static FIRST_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    // private book: Opening;

    constructor(props: IChessboardProps) {

        super(props);
        console.log('props', props);

        this.chess = new Chess();
        this.state = {
            fen: AwesomeChessboard.FIRST_POSITION,
            orientation: 'white',
            evaluation: {}
        };
    }


    render() {
        return (
            <div className="brown">
                <div id="awesome-chessboard" className="is2d"/>

                <div className="fen">
                    FEN: <input className="form-control form-control-sm" value={this.props.fen}/>
                </div>
            </div>
        );
    }

    handleWorkerResult(data) {
        this.setState({
            evaluation: data
        })
    }

    handleFenChange = (e: any) => {
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
                this.chess = new Chess(move.fen);
                this.board.set({
                    turnColor: toColor(this.chess),
                    movable: {
                        color: toColor(this.chess),
                        dests: toDests(this.chess)
                    },
                    fen: move.fen
                });
                this.board.redrawAll();
                this.updateStatus();
            }
        }
    }

    private updateStatus() {
        const moveColor = this.chess.turn() === 'b' ? 'Black' : 'White';

        // checkmate?
        if (this.chess.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        } else if (this.chess.in_draw() === true) { // draw?
            status = 'Game over, drawn position';
        } else { // game still on
            status = moveColor + ' to move';
            // check?
            if (this.chess.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        store.dispatch(setStatus(status));
    }

    private initChessGame() {
        const chess = new Chess();
        const moves:IHistoryMove[] = getHistoryParents(getLastMove());
        moves.reverse();
        for (let move of moves) {
            chess.move({from: move.notation.substring(0, 2), to: move.notation.substring(2, 4)});
        }

        return chess;
    }

    private playOtherSide(cg: Api) {
        return (orig, dest) => {
            this.chess = this.initChessGame();
            const lastMove: any = this.chess.move({from: orig, to: dest});
            const fen: string = this.chess.fen();
            const uuid = guid();
            const parentId = getLastMove();
            // const parentMove = getHistory()[parentId];
            const child = getHistoryChildren(parentId);
            console.log('child',child);
            // if in children there is same move then only change last move. Do not add new move 

            store.dispatch(setHistoryMove({
                parentId: getLastMove(),
                isMain: !child,
                uuid,
                fen,
                notation: `${orig}${dest}`,
                shortNotation: `${lastMove.san}`,
            }));

            store.dispatch(lastMoveId(uuid));
        };
    }

    componentDidMount() {
        const el: any = document.getElementById('awesome-chessboard');
        this.board = Chessground(el, {
            orientation: 'white',
            addPieceZIndex: true,
            movable: {
                // color: 'white',
                free: false,
                dests: toDests(this.chess)
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

        // auto saving for history

        let gameState;

        setInterval(()=>{
                const history = store.getState()['history'];
                console.log('history', history);
                const user = store.getState()['user'];
                if(gameState!==history){
                    ApiManagerService.saveGame(history, user);
                }
        }, 30000);

    }

    //
    // componentDidMount1() {
    //     const chess = new Chess();
    //
    //     interface IKeys {
    //         [key: string]: Key[];
    //     }
    //
    //     const getPossibleMoves = () => {
    //         const possibleMoves = chess.moves({verbose: true});
    //         const moves = {};
    //         possibleMoves.forEach((m) => {
    //             if (!moves[m.from]) {
    //                 moves[m.from] = [];
    //             }
    //             moves[m.from].push(m.to);
    //         });
    //
    //         return moves;
    //     }
    //
    //
    //     const config: any = {
    //         movable: {
    //             color: 'white',
    //             free: false,
    //             dests: getPossibleMoves(),
    //             showDests: true // whether to add the move-dest class on squares
    //         },
    //
    //     };
    //
    //
    //     const el: any = document.getElementById('awesome-chessboard');
    //
    //
    //     const ground = Chessground(el, config);
    //
    //     const playOtherSide = (orig: Key, dest: Key, metadata: cg.MoveMetadata): any => {
    //
    //         console.log('orig, dest, metadata', orig, dest, metadata);
    //
    //         const move = chess.move(`${orig}${dest}`, {sloppy: true});
    //
    //         ground.move(orig, dest);
    //
    //
    //         if (move) {
    //             ground.set({
    //                 turnColor: chess.turn() === 'b' ? 'black' : 'white',
    //                 movable: {
    //                     dests: getPossibleMoves()
    //                 }
    //             });
    //
    //             console.log('ground', ground);
    //         }
    //
    //         ground.redrawAll();
    //
    //
    //     }
    //
    //     ground.set({
    //         movable: {
    //             events: {
    //                 after: playOtherSide
    //             }
    //         }
    //     });
    //
    //
    //     console.log('init fen', ground.getFen());
    //
    // }
}

function mapStateToProps(state: any) {
    return {
        fen: state.fen,
        history: state.history,
        isFlip: state.isFlip,

        lastMoveId: state.lastMoveId
    }
}


function mapDispatchToProps(state: any) {
    return {}
}

export const SmartAwesomeChessboard = connect(mapStateToProps, mapDispatchToProps)(AwesomeChessboard);