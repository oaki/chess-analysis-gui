import * as React from 'react';
// import Chessdiagram from 'react-chessdiagram';
import ChessBoard from 'chessboardjs';
import Chess from 'chess.js';

import * as io from 'socket.io-client';

const socket = io('https://46.101.142.43');

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

// const lightSquareColor = '#f0d9b5'; // light blue
// const darkSquareColor = '#b58863'; // dark blue
// const currentPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // starting position
// const flip = false;
// const squareSize = 30;

class App extends React.Component<any, any> {

    private board: ChessBoard = null;
    private game: Chess = null;

    constructor(props: any) {
        super(props);

        this.game = new Chess();
        this.state = {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            orientation: 'white',
            evaluation: {}
        };

        socket.on('on_result', (result)=> {
            console.log('browser: on_result', result);
            this.handleWorkerResult(result.data);
        });

    }

    handleWorkerResult(data){
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

    render() {

        return (
            <div className="app">
                <header className="app__header">
                    <div className="app__burger">dd</div>
                </header>

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
            </div>
        );
    }

    componentDidUpdate() {
        this.board.position(this.state.fen);
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

            updateStatus();
            return true;
        };

        const cfg = {
            draggable: true,
            position: this.state.fen,
            orientation: this.state.orientation,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };

        this.board = new ChessBoard('chessboard', cfg);

        console.log(this.board);
    }
}

export default App;
