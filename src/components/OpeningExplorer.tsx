import * as React from "react";
import {connect} from 'react-redux';
import '../assets/css/explorerBox.css';
import {loadOpeningPosition, setMove} from "../actions";
import guid from "../libs/uuid";
import {store} from "../store";

export class OpeningExplorer extends React.Component<IOpeningExplorerProps, IOpeningExplorerState> {

    componentDidUpdate(prevProps) {
        if (prevProps.fen !== this.props.fen) {
            store.dispatch(loadOpeningPosition(this.props.fen));
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.props.handleMove(e.currentTarget.dataset.move, e.currentTarget.dataset.fen);
    }

    renderTr() {

        return this.props.moves.map((item: Move, index) => {
            return (
                <tr key={index} onClick={this.handleClick} data-move={item.move} data-fen={item.fen}>
                    <td>
                        {item.move}
                    </td>
                    <td>{item.weight}</td>
                </tr>
            )
        })
    }

    render() {

        if (this.props.moves.length === 0) {
            return null;
        }
        return (
            <div className="explorer-box">

                <div className="data">
                    <table className="moves">
                        <thead>
                        <tr>
                            <th>Move</th>
                            <th>Weight</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderTr()}
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        moves: state.openingMoves || [],
        fen: state.fen
    }
}

function mapDispatchToProps(dispatch: (data: any) => {}) {
    return {
        handleMove(move: string, fen: string) {
            console.log('handleMove', fen, move);
            dispatch(setMove(move.substring(0, 2), move.substring(2, 4), guid()));
        }
    };
}

export interface Move {
    move: string;
    weight: number;
    fen: string;
}

export interface IOpeningExplorerProps {
    moves: Move[],
    fen: string,
    handleMove: (move: string, fen: string) => {}
}

export interface IOpeningExplorerState {

}

export const SmartOpeningExplorer = connect(mapStateToProps, mapDispatchToProps)(OpeningExplorer);