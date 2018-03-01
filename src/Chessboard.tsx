import * as React from 'react';
import {connect} from 'react-redux';
import ChessBoard from 'chessboardjs';
import Chess from 'chess.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import * as $ from 'jquery';

const win: any = window;
win.$ = $;

import './assets/css/app.css';


import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import {setPosition} from "./actions";
import {store} from "./store";

export class Chessboard extends React.Component<any, any> {

    private board: ChessBoard = null;
    private game: Chess = null;
    private history: string[] = [];

    // private book: Opening;

    constructor(props: any) {

        super(props);
        console.log('props',props);

        this.game = new Chess();
        this.state = {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            orientation: 'white',
            evaluation: {}
        };

    }


    render() {
        return (
            <div>
                <div id="chessboard"/>
                <div className="bottom-menu">
                    <ul>
                        {/*<li>www</li>*/}
                        {/*<li>2</li>*/}

                        <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>
                        <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>
                        <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>
                    </ul>
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
        this.setState({
            fen: e.target.value
        });

        //  board.position('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');
    }

    handleFlipBoard = (e: any) => {
        e.preventDefault();
        this.board.flip();
    }

    handleUndo = (e: any) => {
        e.preventDefault();
        const moves = this.game.history();
        const tmp: any = new Chess();
        const previous = moves.length - this.history.length - 1;
        for (let i = 0; i < previous; i++) {
            tmp.move(moves[i]);
        }
        const previous_fen = tmp.fen();
        tmp.move(moves[previous]);
        this.history.push(tmp.fen());
        this.board.position(previous_fen);
        // return previous_fen;
        // this.game.undo();

    }

    handleRedo = (e: any) => {
        e.preventDefault();
        this.board.position(this.history.pop());
    }


    componentDidUpdate() {
        // this.board.position(this.state.fen);
    }

    componentDidMount() {

        // do not pick up pieces if the game is over
        // only pick up pieces for the side to move
        const onDragStart = (source, piece) => {
            if (this.game.game_over() === true ||
                (this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
            return true;
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        const onSnapEnd = () => {
            this.board.position(this.game.fen());
        };

        const updateStatus = () => {
            let status = '';

            let moveColor = 'White';
            if (this.game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (this.game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            } else if (this.game.in_draw() === true) { // draw?
                status = 'Game over, drawn position';
            } else { // game still on
                status = moveColor + ' to move';
                // check?
                if (this.game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }

            store.dispatch(setPosition(this.game.fen()));
            console.log('emit->setNewPosition', this.game.fen());
            console.log(status);
            // socket.emit('setNewPosition', {
            //     FEN: this.game.fen()
            // });
            // this.setState({
            //     status: status,
            //     fen: this.game.fen(),
            //     pgn: this.game.pgn()
            // });

        };

        const onDrop = (source, target) => {
            // see if the move is legal
            const move = this.game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) {
                return 'snapback';
            }

            // this.board.find('.square-' + source).addClass('highlight-white');
            // this.board.find('.square-' + target).addClass('highlight-white');

            updateStatus();
            return true;
        };

        const onMoveEnd = () => {
            // this.board.find('.square-' + squareToHighlight)
            //     .addClass('highlight-' + colorToHighlight);
        };

        const cfg = {
            draggable: true,
            position: this.state.fen,
            orientation: this.state.orientation,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd,
            onMoveEnd: onMoveEnd
        };

        this.board = new ChessBoard('chessboard', cfg);

        console.log(this.board);
    }
}

function mapStateToProps(state: any) {
    return {
        position: state.position
    }
}


function mapDispatchToProps(state: any) {
    return {}
}

export const SmartChessboard = connect(mapStateToProps, mapDispatchToProps)(Chessboard);