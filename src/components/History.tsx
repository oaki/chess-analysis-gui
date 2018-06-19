import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {IHistoryMove} from "./AwesomeChessboard";
import {getHistory, getHistoryLine, getHistoryMove} from "../libs/chessboardUtils";
import {lastMoveId, setEvaluation, setOpeningPosition, setPosition} from "../actions";
import {store} from "../store";
import {filter} from "lodash";
import {batchActions} from "redux-batched-actions";

const classNames = require('classnames');

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

    renderMoveNum(index) {
        if (index % 2 === 1) {
            return null
        }
        const counter = Math.round((index) / 2) + 1;
        const className = ` move_num move_num_${counter}`;
        return <span key={`move_${index}`} className={className} id={className}>{counter}. </span>
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
                setOpeningPosition([])
            ]));
        }
    }


    renderMoves(counter = 0, parentId = '') {
        const history: any = getHistory();
        const moves = filter(history, (move) => {
            return move.parentId === parentId;
        }).sort((a, b) => {
            return a.isMain | b.isMain;
        });


        return moves.map((move: IHistoryMove, index) => {
            if (index > 0) {
                return (
                    <div className="subline" key={index}>
                        {this.renderLine(counter, move, index)}
                    </div>
                )
            } else {
                return this.renderLine(counter, move, index)
            }
        })
    }

    renderLine(counter, move, index) {
        let className = classNames('move', {
            move__active: move.uuid === this.props.lastMoveId
        });

        return [
            this.renderMoveNum(counter),
            (
                <span onClick={this.handleMoveClick} className={className} key={index} data-uuid={move.uuid}>
                    {move.shortNotation}
                </span>),
            this.renderMoves(counter + 1, move.uuid)
        ]
    }

    render() {

        const count = this.props.history.length;
        const sliderWidth = count * 35 + Math.round(count / 2) * 20;
        const style = {
            width: `${sliderWidth}px`
        };
        return (
            <div className="history">
                <div className="history__title">
                    History
                </div>
                <div className="history__slider">
                    <div className="history__slider__holder" style={style}>
                        {this.renderMoves()}
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        const num = this.getMoveNumber();
        // const node = ReactDOM.findDOMNode(this).getElementsByClassName('history__slider__holder')[0];
        const els: NodeListOf<Element> = ReactDOM.findDOMNode(this).getElementsByClassName(`move`);

        if (els.length) {
            els[els.length - 1].scrollIntoView();
        }
        // node.scrollLeft = elem.scrollHeight;

        // console.log('node.scrollLeft',node.scrollLeft);
    };
}
