import store from "../../store";
import * as React from "react";
import {connect} from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/fontawesome-free-solid";
import {batchActions} from "redux-batched-actions";
import {setEvaluation, setPosition, setUser} from "../../actions";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {IHistoryMove, lastMoveId, setHistory} from "../history/historyReducers";
import {setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {NODE_MAP} from "../moveTree/tree";
import {IHistoryGameResponse} from "./historyListReducers";

const format = require("date-fns/format");


const mapStateToProps = (state) => ({historyList: state.historyList});

export class Hl extends React.Component<any, any> {
    handleLoadGame = (e) => {
        e.preventDefault();

        const id: number = Number(e.currentTarget.dataset.id);
        const historyGameResponse: IHistoryGameResponse = this.props.historyList.find((item: IHistoryGameResponse) => {
            return Number(item.id) === id;
        });

        console.log("historyGameResponse", historyGameResponse);

        if (historyGameResponse) {
            const user = store.getState()["user"];
            store.dispatch(batchActions([
                setUser(user),
                setHistory(historyGameResponse.moves),
                lastMoveId(null),
                setPosition(""),
                setOpeningPosition([]),
                setEvaluation([]),
                setSyzygyEvaluation(null),
            ]));

        }

        this.props.history.push("/");
    }

    private formatDate(date: string) {
        return format(date, "DD.MM.YYYY");
    }

    private showMoveNumber(index: number) {
        const tmp = index % 2;

        if (tmp === 1) {
            return null;
        }

        const num = Math.round(index / 2) + 1;
        return (
            <span className="fs-xs">{num}. </span>
        )
    }

    private prepareMoves(historyMoves: IHistoryMove[]) {

        return historyMoves.map((move: IHistoryMove, index) => {
            return (
                <span className="" key={index}>{this.showMoveNumber(index)}{move[NODE_MAP.shortNotation]} </span>
            )
        })
    }

    renderItem() {
        const className = "d-b p-md cur-p list__bottom-line";
        return this.props.historyList.map((historyGame: IHistoryGameResponse, index) => (
            <li key={index} className={className} onClick={this.handleLoadGame} data-id={historyGame.id}>
                <span className="c-white f-r"><FontAwesomeIcon icon={faArrowRight}/></span>

                <div className="fs-xs">{this.formatDate(historyGame.updated_at)}</div>
                <div className="list__moves ox-a fs-6">
                    <div className="list__viewport">
                        {this.prepareMoves(historyGame.moves)}
                    </div>
                </div>
            </li>
        ))
    }


    render() {
        return (
            <ul>
                {this.renderItem()}
            </ul>
        )
    }
}

export const HistoryList = connect(mapStateToProps)(Hl);