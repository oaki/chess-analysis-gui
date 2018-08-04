import * as React from "react";
import {connect} from "react-redux";
import "../assets/css/explorerBox.css";
import {setError, setLoading} from "../actions";
import {store} from "../store";
import {setMove} from "./history/History";
import {treeService} from "./moveTree/tree";
import config from "../config";

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

export interface IOpeningMove {
    move: string;
    weight: number;
    fen: string;
    san: string;
}

export interface IOpeningExplorerProps {
    moves: IOpeningMove[],
    fen: string,
    handleMove: (move: string, fen: string) => {}
}

export interface IOpeningExplorerState {

}

export const SmartOpeningExplorer = connect(mapStateToProps, mapDispatchToProps)(OpeningExplorer);

export function loadOpeningPosition(fen: string) {
    return async (dispatch: (data: any) => {}) => {
        console.log("loadOpeningPosition", fen);
        dispatch(setLoading(true));

        const url = `${config.apiHost}/opening-book?fen=${fen}`;
        const headers: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };

        try {
            const response = await fetch(url, headers);
            if (response.ok) {
                const moves: any = await response.json();
                console.log(moves);
                dispatch(setOpeningPosition(moves));
            } else {
                dispatch(setOpeningPosition([]));
            }

        } catch (e) {
            dispatch(setError("opening book failed"));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function setOpeningPosition(moves: IOpeningMove[]) {
    return {
        moves,
        type: SET_OPENING_POSITION
    };
}

export const SET_OPENING_POSITION = "SET_OPENING_POSITION";

export function openingMovesReducer(moves: IOpeningMove[] = [], action: any) {

    switch (action.type) {
        case SET_OPENING_POSITION:
            return action.moves;

        default:
            return moves;
    }
};
