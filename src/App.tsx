import * as React from 'react';
// import Chessdiagram from 'react-chessdiagram';
import ChessBoard from 'chessboardjs';
import Chess from 'chess.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft';
import * as faAngleDoubleRight from '@fortawesome/fontawesome-free-solid/faAngleDoubleRight';
import * as faRetweet from '@fortawesome/fontawesome-free-solid/faRetweet';

import * as io from 'socket.io-client';

const socket = io(config.host);

/*
const ChessTools = require('chess-tools');
const OpeningBook = ChessTools.OpeningBook.CTG;
    const book = new OpeningBook();
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq";

    book.load_book(stream);
    book.on("loaded", ()=> {
    let entries = book.find(fen);
    for (let entry of entries) {
    //See entry.js for each module to manage data.
}
}); */

import * as $ from 'jquery';

const win: any = window;
win.$ = $;
// const Chessdiagram: React.Component = require('react-chessdiagram');

import './App.css';
import config from "./config";
import Opening from "./openingBook";

// const lightSquareColor = '#f0d9b5'; // light blue
// const darkSquareColor = '#b58863'; // dark blue
// const currentPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
// const flip = false;
// const squareSize = 30;

class App extends React.Component<any, any> {

    private board: ChessBoard = null;
    private game: Chess = null;
    private history: string[] = [];
    // private book: Opening;

    constructor(props: any) {
        super(props);

        this.game = new Chess();
        this.state = {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            orientation: 'white',
            evaluation: {}
        };

        socket.on('on_result', (result) => {
            console.log('browser: on_result', result);
            this.handleWorkerResult(result.data);
        });

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
        // console.log(this.history.pop());
        // console.log(this.game.moves());
        // this.game.undo();
        // this.board.position(this.game.fen());
    }

    render() {

        return (
            <div className="app">
                <header className="app__header">
                    <div className="app__burger">{}</div>
                </header>
                {this.state.loading && <div className="loading">loading...</div>}

                <div>
                    <input type="text" onChange={this.handleFenChange}/>
                </div>

                <div id="chessboard"/>
                <div className="app__status">

                    {this.state.evaluation && <div className="score">{this.state.evaluation.score}</div>}
                    {this.state.evaluation && <div className="mate">{this.state.evaluation.mate}</div>}
                    {this.state.evaluation && <div className="nodes">{this.state.evaluation.nodes}</div>}
                    {this.state.evaluation && <div className="pv">{this.state.evaluation.pv}</div>}
                    <div className="app__opening">Caro can</div>
                    <div className="app__pgn">{this.state.pgn}</div>
                    <div className="app__fen">{this.state.fen}</div>
                    <div className="app__menu">
                        <ul>
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                        </ul>
                    </div>
                </div>

                <div className="bottom-menu">
                    <ul>
                        <li>www</li>
                        <li>2</li>

                        <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>
                        <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>
                        <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>
                    </ul>
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        this.board.position(this.state.fen);
    }

    async loadOpeningBook() {
        this.setState({
            loading: true
        });

        const opening = new Opening();
        await opening.loadBook();

        return opening;
    }

    handleLoadOpeningBook = () => {
        this.setState({
            loading: true
        });
        // const _book = this.book;
        this.loadOpeningBook().then((book) => {
            // _book = book;
            this.setState({
                loading: false
            })
        });

    }

    componentDidMount() {

        this.handleLoadOpeningBook();

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

            console.log('emit->setNewPosition', this.game.fen());
            socket.emit('setNewPosition', {
                FEN: this.game.fen()
            });
            this.setState({
                status: status,
                fen: this.game.fen(),
                pgn: this.game.pgn()
            });

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

export default App;
