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

const classNames = require("classnames");

interface IHistoryProps {
    history: string[];
    lastMoveId: string;
}


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

            store.dispatch(emitPosition(fen));
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
