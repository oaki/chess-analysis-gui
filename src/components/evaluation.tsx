import * as React from "react";
import * as Chess from "chess.js";
import {connect} from "react-redux";

import {IEvaluation, LINE_MAP} from "../interfaces";
import {SocketManagerService} from "../services/socketService";
import {isYourMove} from "../libs/isYourMove";

export interface Evaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface SocketIoProviderProps {
    evaluation: Evaluation[]
}


@connect((state) => ({
    fen: state.fen,
    evaluation: state.evaluation,
    onMove: state.onMove,
    isFlip: state.isFlip
}))
export class Evaluation extends React.Component<any, any> {

    static splitPv(pv: string) {
        return pv.split(" ");
    }

    prepareEvaluation(pv: string, fen: string) {
        const chess = new Chess(fen);

        const moves = Evaluation.splitPv(pv);

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
                // if (newMove.promotion) {
                //     annotationMove += `=${newMove.promotion}`;
                // }

                newMoves.push(annotationMove);
            }
        }

        return newMoves;
    }

    renderLine(evaluation: IEvaluation) {
        return (
            <React.Fragment key={evaluation[LINE_MAP.pv]}>
                <div className="evaluation">
                    {evaluation && <div className="score">
                        <span>{this.getScore(evaluation)}</span>
                        {!evaluation[LINE_MAP.mate] &&
                        <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
                    </div>}

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

                {evaluation &&
                <div className="evaluation-info">
                    <table>
                        <tbody>
                        <tr>
                            <td className="fs-xs ta-c">Nodes: {this.getNodes(evaluation)}</td>
                            <td className="fs-xs ta-c">Time: {this.getTime(evaluation)}</td>
                            <td className="fs-xs ta-c">Tb hits: {this.getTbHits(evaluation)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>}
            </React.Fragment>
        )
    }

    render() {

        if (this.props.evaluation.length === 0) {
            return null
        }
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
        let score = Number(evaluation[LINE_MAP.score]);

        if (evaluation[LINE_MAP.mate]) {
            return `#${Number(evaluation[LINE_MAP.mate])}`;
        }

        if (!isYourMove(this.props.onMove, this.props.isFlip)) {
            score *= (-1);
        }

        if (score >= 0) {
            return `+${score}`;
        }

        return score;
    }

    getNodes(evaluation: IEvaluation) {
        return this.formatNumber(evaluation[LINE_MAP.nodes]);

    }

    getTime(evaluation: IEvaluation) {
        if (evaluation[LINE_MAP.time]) {
            const time = Number(evaluation[LINE_MAP.time]) / 1000;
            return `${time.toFixed(0)}s`;
        }
        return 0;

    }

    getTbHits(evaluation: IEvaluation) {
        return this.formatNumber(evaluation[LINE_MAP.tbhits]);
    }


    private formatNumber(num: number | string | undefined) {
        if (num) {
            const n = Number(num);

            if (n > 1000000) {
                const d = n / 1000000;
                return `${d.toFixed(2)}M`;
            }

            if (n > 1000) {
                const d = n / 1000;
                return `${d.toFixed(0)}K`;
            }

            return n;

        }
    }

}