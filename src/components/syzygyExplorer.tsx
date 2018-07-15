import * as React from "react";
import {connect} from "react-redux";
import "../assets/css/explorerBox.css";
import {IAction} from "../interfaces";
import guid from "../libs/uuid";
import {setMove} from "../actions";
import {store} from "../store";

export class SyzygyExplorer extends React.Component<any, any> {

    renderMoves(move: ISyzygyMove) {
        return (
            <button onClick={this.props.handleClickMove} data-move={move.uci} className="btn btn-syzygy">
                {move.san}
            </button>
        )
    }

    render() {

        if (this.props.syzygy === null) {
            return null;
        }

        const moves: ISyzygyMove[] = this.props.syzygy.moves;

        /**
         "wdl": 2, // (2) win, (1) cursed win, (0) draw, (-1) blessed loss, (-2) loss, (null) unknown
         "dtz": 1, // distance to zeroing or null if unknown
         "dtm": 17, // depth to mate or null if unknown
         "insufficient_material": false,
         "moves": [ // information about legal moves, best first
         */
        const winMoves = moves.filter((move: ISyzygyMove) => {
            return move.wdl === -1 || move.wdl === -2;

        });

        const drawMoves = moves.filter((move: ISyzygyMove) => {
            return move.wdl === 0
        });

        const losingMoves = moves.filter((move: ISyzygyMove) => {
            return move.wdl === 2 || move.wdl === 1;
        });

        return (
            <div className="explorer-box">

                <div className="data">
                    {winMoves.length > 0 &&
                    <div className="fs-6">
                        Win:{winMoves.map((move: ISyzygyMove) => this.renderMoves(move))}
                    </div>
                    }
                    {drawMoves.length > 0 &&
                    <div className="fs-6">
                        Draw:{drawMoves.map((move: ISyzygyMove) => this.renderMoves(move))}
                    </div>
                    }
                    {losingMoves.length > 0 &&
                    <div className="fs-6">
                        Losing:{losingMoves.map((move: ISyzygyMove) => this.renderMoves(move))}
                    </div>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        syzygy: state.syzygy || null,
    }
}

function mapDispatchToProps(dispatch: (data: any) => {}) {
    return {
        handleClickMove(e) {
            console.log("handleClickMove", e.currentTarget);
            const move = e.currentTarget.dataset.move;
            const fen = store.getState()["fen"];
            console.log({move, fen});

            const promotion = move.length > 4 && move.substring(4, 5) || "q";


            dispatch(setMove({
                from: move.substring(0, 2),
                to: move.substring(2, 4),
                uuid: guid(),
                promotion,
                fen
            }));
        }
    };
}

export const SET_SYZYGY_EVALUATION = "SET_SYZYGY_EVALUATION";

export function setSyzygyEvaluation(syzygy: ISyzygy | null) {
    return {
        payload: syzygy,
        type: SET_SYZYGY_EVALUATION
    };
}

// export const userReducer = (user: IUser = SessionManagerService.getUser(), action: IAction<IUser>) => {

export const syzygyReducer = (syzygy: ISyzygy | null = null, action: IAction<ISyzygy>) => {
    switch (action.type) {
        case SET_SYZYGY_EVALUATION:
            return action.payload;

        default:
            return syzygy;
    }
};


export interface ISyzygyMove {
    uci: string;
    san: string;
    zeroing: boolean;
    checkmate: boolean;
    stalemate: boolean;
    variant_win: boolean;
    variant_loss: boolean;
    insufficient_material: boolean;
    wdl: number;
    dtz: number;
    dtm?: any;
}

export interface ISyzygy {
    checkmate: boolean;
    stalemate: boolean;
    variant_win: boolean;
    variant_loss: boolean;
    insufficient_material: boolean;
    wdl: number;
    dtz: number;
    dtm?: any;
    moves: ISyzygyMove[];
}


// this.store.dispatch(setSyzygyEvaluation(results));

export const SyzygyExplorerSmart = connect(mapStateToProps, mapDispatchToProps)(SyzygyExplorer);