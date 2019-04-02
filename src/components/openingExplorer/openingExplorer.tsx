import * as React from "react";
import {connect} from "react-redux";
import store from "../../store";
import {setMove} from "../history/historyReducers";
import {treeService} from "../moveTree/tree";
import "../../assets/css/explorerBox.css";
import {IOpeningExplorerProps, IOpeningExplorerState, IOpeningMove} from "./openingExplorerReducers";

export class OpeningExplorer extends React.Component<IOpeningExplorerProps, IOpeningExplorerState> {

    // componentDidUpdate(prevProps) {
    //     if (prevProps.fen !== this.props.fen) {
    //         store.dispatch(loadOpeningPosition(this.props.fen));
    //     }
    // }

    handleClick = (e) => {
        e.preventDefault();
        this.props.handleMove(e.currentTarget.dataset.move, e.currentTarget.dataset.fen);
    }

    renderTr() {

        return this.props.moves.map((item: IOpeningMove, index) => {
            return (
                <tr key={index} onClick={this.handleClick} data-move={item.move}>
                    <td>
                        {item.san}
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
        handleMove(move: string) {
            const fen = store.getState()["fen"];

            dispatch(setMove({
                from: move.substring(0, 2),
                to: move.substring(2, 4),
                id: treeService.getCounter(),
                fen
            }));
        }
    };
}


export const SmartOpeningExplorer = connect(mapStateToProps, mapDispatchToProps)(OpeningExplorer);
