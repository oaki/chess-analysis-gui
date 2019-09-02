import * as React from "react";
import {connect} from "react-redux";
import {setEvaluation, setPosition} from "../../actions";
import store from "../../store";
import {batchActions} from "redux-batched-actions";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {NODE_MAP, treeService} from "../moveTree/tree";
import {IMoves, Moves} from "./moves";
import {loadOpeningPosition, setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {lastMoveId} from "./historyReducers";
import {emitPosition} from "../../services/sockets/actions";
import {loadGamesFromDatabase} from "../gamesDatabaseExplorer/gamesDatabaseReducers";
import {IEvaluation} from "../../interfaces";

@connect((state) => ({
    history: state.history,
    lastMoveId: state.lastMoveId,
}))
export class History extends React.Component<any, any> {


    handleMoveClick(e) {
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
            let previousEvaluation: IEvaluation | null = null;
            let evaluation: IEvaluation | null = null;
            const evaluations = ref.node[NODE_MAP.evaluation];
            if (evaluations && evaluations[0]) {
                evaluation = evaluations[0];
            }

            if (ref.parent.length > 2 && ref.parent[ref.parent.length - 2]) {
                const prevRef = ref.parent[ref.parent.length - 2];
                const prevEvaluations = prevRef[NODE_MAP.evaluation];
                if (prevEvaluations && prevEvaluations[0]) {
                    previousEvaluation = prevEvaluations[0];
                }
            }

            store.dispatch(emitPosition(fen, ref.node[NODE_MAP.move], previousEvaluation, evaluation));

            store.dispatch(loadOpeningPosition(fen));
            store.dispatch(loadGamesFromDatabase(fen));
        }
    }

    prepareMovesProps(): IMoves {
        return {
            moves: this.props.history,
            counter: 0,
            level: 0,
            lastMoveId: this.props.lastMoveId,
            handleMoveClick: this.handleMoveClick,
            showBracket: false
        }
    }

    render() {
        return (
            <div className="history">

                <div className="history__slider">
                    <Moves {...this.prepareMovesProps()}/>
                </div>
            </div>
        )
    }


}
