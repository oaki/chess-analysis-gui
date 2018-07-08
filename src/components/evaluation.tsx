import * as React from "react";
import * as Chess from "chess.js";
import {connect} from "react-redux";

import {IEvaluation, LINE_MAP} from "../interfaces";
import {SocketManagerService} from "../services/socketManager";

export interface Evaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface SocketIoProviderProps {
    evaluation: Evaluation[]
}


@connect((state) => ({fen: state.fen, evaluation: state.evaluation}))
export class Evaluation extends React.Component<any, any> {

    prepareEvaluation(pv: string, fen: string) {
        const chess = new Chess(fen);

        const moves = pv.split(" ");

        const newMoves: any = [];
        if (moves && moves.length > 0) {
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                const newMove = chess.move(move, {sloppy: true});
                if (!newMove) {
                    console.log("Move doesn't exist", {move, fen});
                    break;
                }

                let annotationMove = `${newMove.san}`;
                if (newMove.promotion) {
                    annotationMove += `=${newMove.promotion}`;
                }

                newMoves.push(annotationMove);
            }
        }

        return newMoves;
    }

    renderLine(evaluation: IEvaluation) {
        return (
            <div className="evaluation" key={evaluation[LINE_MAP.pv]}>
                {evaluation && <div className="score">
                    <span>{this.getScore(evaluation)}</span>
                    <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>
                </div>}

                {/*{this.props.evaluation && <span className="nodes">{this.getNodes()}</span>}*/}
                {evaluation && <div className="c-pv ml-5">
                    <div className="pv-holder">
                        {this.prepareEvaluation(evaluation[LINE_MAP.pv], this.props.fen).map((move, index) => {
                            return (
                                <span className="pv-holder__move" key={index}>{move}</span>
                            )
                        })}
                    </div>
                </div>}
            </div>
        )
    }

    render() {

        if (this.props.evaluation.length === 0) {
            return null
        }
        console.log("this.props.evaluation", this.props.evaluation);
        return this.props.evaluation.map((evaluation) => this.renderLine(evaluation));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fen !== this.props.fen) {
            console.log("setNewPosition");
            SocketManagerService.emit("setNewPosition", {
                FEN: this.props.fen
            });
        }
    }

    getScore(evaluation: IEvaluation) {
        const score = evaluation[LINE_MAP.score];
        if (Number(score) >= 0) {
            return `+${score}`;
        }

        return score;
    }

    getNodes() {
        const nodes = this.props.evaluation[LINE_MAP.nodes];
        const d = nodes / 1000;
        return `${d}K`;
    }

}