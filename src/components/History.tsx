import * as React from "react";
import {connect} from "react-redux";
import {IHistoryMove} from "./chessboard/chessboard";
import {getHistory, getHistoryMove} from "../libs/chessboardUtils";
import {lastMoveId, SET_HISTORY, SET_HISTORY_MOVE, setEvaluation, setOpeningPosition, setPosition} from "../actions";
import {store} from "../store";
import {filter} from "lodash";
import {batchActions} from "redux-batched-actions";
import {setSyzygyEvaluation} from "./syzygyExplorer";
import {IAction} from "../interfaces";

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


    private getMoveNumber() {
        return Math.round((this.props.history.length + 1) / 2);
    }

    renderMoveNum(counter) {
        const className = ` move_num move_num_${counter}`;
        return <span key={`move_${counter}`} className={className} id={className}>{counter}. </span>
    }

    handleMoveClick(e) {
        e.preventDefault();
        const uuid = e.currentTarget.dataset.uuid;
        const move = getHistoryMove(uuid);
        if (move) {
            store.dispatch(batchActions([
                lastMoveId(move.uuid),
                setPosition(move.fen),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([])
            ]));
        }
    }

    prepareToRender() {
        const historyData = getHistory();

        function findMoves(data, parentId: string) {
            return filter(historyData, (move) => {
                return move.parentId === parentId;
            });
        }

        const output: any = [];

        function prepare(parentId, num) {
            const moves = findMoves(historyData, parentId);


            // if (index % 2 === 1) {
            //     return null
            // }
            // const counter = Math.round((index) / 2) + 1;
            // const className = ` move_num move_num_${counter}`;
            // return <span key={`move_${index}`} className={className} id={className}>{counter}. </span>
            if (moves.length > 0) {
                moves.forEach((move, index) => {
                    output.push({
                        num: num,
                        counter: num % 2 === 1 ? null : Math.round((num) / 2) + 1,
                        index,
                        uuid: move.uuid,
                        shortNotation: move.shortNotation,
                    });
                });

                moves.forEach((move) => {
                    prepare(move.uuid, num + 1);
                })
            }
        }

        prepare("", 0);

        console.log("preparedDataHistyr", output);
        return output;
    }

    renderMoves(history, counter = 0, parentId = "") {

        const moves = filter(history, (move) => {
            return move.parentId === parentId;
        });

        const output: any[] = [];

        moves.forEach((move: IHistoryMove, index: number) => {
            if (index === 0) {
                output.push(this.renderLine(counter, move, index));
            } else {
                const tmp = (
                    <div className="subline" key={index}>
                        {this.renderLine(counter, move, index)}
                    </div>
                );
                output.push(tmp);
            }
        })

        return output;
    }

    renderLine(counter, move, index) {
        let className = classNames("move", {
            move__active: move.uuid === this.props.lastMoveId
        });

        return [
            this.renderMoveNum(counter),
            (
                <span onClick={this.handleMoveClick} className={className} key={index} data-uuid={move.uuid}>
                    {move.shortNotation}
                </span>),
            this.renderMoves(getHistory(), counter + 1, move.uuid)
        ]
    }

    render() {

        const data = this.prepareToRender();
        return (
            <div className="history">

                <div className="history__slider">
                    <div className="history__slider__holder">
                        {data.map((move, index) => {
                            let className = "move";

                            if (move.index > 0) {
                                className += " history__subline";
                            }
                            return (
                                <span
                                    onClick={this.handleMoveClick}
                                    className={className}
                                    key={index}
                                    data-uuid={move.uuid}
                                >
                                    {move.counter && this.renderMoveNum(move.counter)}
                                    {move.shortNotation}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export const historyReducer = (state: IHistoryMove[] = [], action: IAction<IHistoryMove | any>) => {
    switch (action.type) {
        case SET_HISTORY_MOVE:
            console.log("state", state);
            console.log("action", action);

            const newState = [...state];
            newState.push(action.payload);
            return newState;

        case SET_HISTORY:
            return action.payload;

        default:
            return state;
    }
};