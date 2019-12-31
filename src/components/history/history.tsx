import * as React from "react";
import {memo} from "react";
import {connect} from "react-redux";
import {setEvaluation, setPosition} from "../../actions";
import store from "../../store";
import {batchActions} from "redux-batched-actions";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {NODE_MAP, treeService} from "../moveTree/tree";
import {Moves} from "./moves";
import {loadOpeningPosition, setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {lastMoveId} from "./historyReducers";
import {emitPosition} from "../../services/sockets/actions";
import {loadGamesFromDatabase} from "../gamesDatabaseExplorer/gamesDatabaseReducers";
import {IEvaluation, Nullable} from "../../interfaces";


const HistoryContainer = memo((props: any) => {

    // @ts-ignore
    const moves = <Moves
        moves={props.history} counter={0}
        level={0}
        lastMoveId={props.lastMoveId}
        handleMoveClick={handleMoveClick}
        showBracket={false}/>;

    return (
        <div className="history">

            <div className="history__slider">
                {moves}
            </div>
        </div>
    )
});

function handleMoveClick(e: any) {
    e.preventDefault();
    const id: number = Number(e.currentTarget.dataset.id);

    const ref = treeService.getReference(id);

    if (ref && ref.node) {
        const fen: string = ref.node[NODE_MAP.fen];
        store.dispatch(batchActions([
            lastMoveId(ref.node[NODE_MAP.id]),
            setPosition(fen),
            setEvaluation([]),
            setSyzygyEvaluation(null),
            setOpeningPosition([])
        ]));

        //todo send previous evaluation
        let previousEvaluation: Nullable<IEvaluation> = null;
        let evaluation: Nullable<IEvaluation> = null;
        const evaluations = ref.node[NODE_MAP.evaluation];
        if (evaluations && evaluations[0]) {
            evaluation = evaluations[0];
        }

        // find prevEvaluation
        const prevMove = treeService.getPrevMove(ref.node[NODE_MAP.id]);
        if (prevMove) {
            const prevEvaluations = prevMove[NODE_MAP.evaluation];
            if (prevEvaluations && prevEvaluations[0]) {
                previousEvaluation = prevEvaluations[0];
            }
        }

        store.dispatch(emitPosition(fen, ref.node[NODE_MAP.move], previousEvaluation, evaluation));

        store.dispatch(loadOpeningPosition(fen));
        store.dispatch(loadGamesFromDatabase(fen));
    }
}

function mapStateToProps(state: any) {
    return {
        history: state.history,
        lastMoveId: state.lastMoveId,
    }
}

export const History = connect(mapStateToProps)(HistoryContainer);
