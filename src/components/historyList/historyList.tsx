import * as React from "react";
import {connect} from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/fontawesome-free-solid";
import {IAction} from "../../interfaces";
import * as moment from "moment";

import {batchActions} from "redux-batched-actions";
import {withRouter} from "react-router";

import {setEvaluation, setPosition, setUser} from "../../actions";
import {store} from "../../store";
import {SessionManagerService} from "../../services/sessionManager";
import {Link} from "react-router-dom"
import {setSyzygyEvaluation} from "../syzygyExplorer";
import {IHistoryMove, lastMoveId, setHistory} from "../history/History";
import {setOpeningPosition} from "../OpeningExplorer";
import {NODE_MAP} from "../moveTree/tree";


@connect((state) => ({historyList: state.historyList}))
export class HistoryList extends React.Component<any, any> {
    handleLoadGame = (e) => {
        e.preventDefault();

        const id: number = Number(e.currentTarget.dataset.id);
        const historyGameResponse: IHistoryGameResponse = this.props.historyList.find((item: IHistoryGameResponse) => {
            return Number(item.id) === id;
        });

        console.log("historyGameResponse", historyGameResponse);

        if (historyGameResponse) {
            const user = store.getState()["user"];

            SessionManagerService.setUser({...user, last_game_id: historyGameResponse.id});

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
        return moment(date).format("D.M.Y");
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


export const SET_HISTORY_GAME_LIST = "SET_HISTORY_GAME_LIST";

export function setHistoryGameList(games: any[]) {
    return {
        payload: games,
        type: SET_HISTORY_GAME_LIST
    };
}

export interface IHistoryGameResponse {
    id: number;
    user_id: number;
    moves: IHistoryMove[];
    created_at: string;
    updated_at: string;
}

export const historyListReducer = (games: IHistoryGameResponse[] = [], action: IAction<IHistoryGameResponse[]>) => {
    switch (action.type) {
        case SET_HISTORY_GAME_LIST:
            return action.payload;

        default:
            return games;
    }
};

