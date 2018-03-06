import * as React from "react";
import {connect} from 'react-redux';
import './assets/css/explorerBox.css';
import {setMove} from "./actions";

export interface Move {
    move: string;
    weight: number;
}

export interface IOpeningExplorerProps {
    moves: Move[],
    handleMove: (move: string) => {}
}

export interface IOpeningExplorerState {

}

export class OpeningExplorer extends React.Component<IOpeningExplorerProps, IOpeningExplorerState> {

    handleClick = (e) => {
        this.props.handleMove(e.currentTarget.dataset.move);
    }

    renderTr() {

        return this.props.moves.map((item: Move, index) => {
            return (
                <tr key={index} onClick={this.handleClick} data-move={item.move}>
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
        moves: state.openingMoves || []
    }
}

function mapDispatchToProps(dispatch: (data: any) => {}) {
    return {
        handleMove(move: string) {
            dispatch(setMove(move));
        }
    };
}

export const SmartOpeningExplorer = connect(mapStateToProps, mapDispatchToProps)(OpeningExplorer);