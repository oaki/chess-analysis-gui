import * as React from "react";
import {memo} from "react";
import {connect} from "react-redux";
import "../../assets/css/explorerBox.css";
import store from "../../store";
import {setMove} from "./../history/historyReducers";
import {treeService} from "./../moveTree/tree";
import {ISyzygyMove} from "./syzygyExplorerReducers";

function renderMoves(move: ISyzygyMove, handleClickMove) {
    return (
        <button onClick={handleClickMove} data-move={move.uci} className="btn btn-syzygy">
            {move.san}
        </button>
    )
}

const SyzygyExplorer = memo((props: any) => {
    if (props.syzygy === null) {
        return null;
    }

    const moves: ISyzygyMove[] = props.syzygy.moves;

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
                  Win:{winMoves.map((move: ISyzygyMove) => renderMoves(move, props.handleClickMove))}
                </div>
                }
                {drawMoves.length > 0 &&
                <div className="fs-6">
                  Draw:{drawMoves.map((move: ISyzygyMove) => renderMoves(move, props.handleClickMove))}
                </div>
                }
                {losingMoves.length > 0 &&
                <div className="fs-6">
                  Losing:{losingMoves.map((move: ISyzygyMove) => renderMoves(move, props.handleClickMove))}
                </div>
                }
            </div>
        </div>
    )
});

function mapStateToProps(state: any) {
    return {
        syzygy: state.syzygy || null,
    }
}

function mapDispatchToProps(dispatch: (data: any) => {}) {
    return {
        handleClickMove(e) {
            const move = e.currentTarget.dataset.move;
            const fen = store.getState()["fen"];

            let promotion = "q";

            if (move.length > 4) {
                promotion = move.substring(4, 5);
            }

            dispatch(setMove({
                from: move.substring(0, 2),
                to: move.substring(2, 4),
                id: treeService.getCounter(),
                promotion,
                fen
            }));
        }
    };
}

export const SyzygyExplorerSmart = connect(mapStateToProps, mapDispatchToProps)(SyzygyExplorer);