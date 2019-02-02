import * as React from "react";
import * as Chess from "chess.js";
import {connect} from "react-redux";

import {IEvaluation, LINE_MAP} from "../interfaces";
import {isYourMove} from "../libs/isYourMove";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faSignal from "@fortawesome/fontawesome-free-solid/faSignal";
import * as faMicrophoneSlash from "@fortawesome/fontawesome-free-solid/faMicrophoneSlash";
import {IOnMove} from "../actions";

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
    isFlip: state.isFlip,
    isOnline: state.isOnline,
    settings: state.settings
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
                      <span>{Evaluation.getScore(evaluation, this.props.onMove, this.props.isFlip)}</span>
                        {!evaluation[LINE_MAP.mate] &&
                        <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
                    </div>}
                </div>

                {evaluation &&
                <div className="evaluation-info">
                  <table>
                    <tbody>
                    <tr>
                      <td className="fs-xs ta-c">
                          {this.props.isOnline && <FontAwesomeIcon className="c-green" icon={faSignal}/>}
                          {!this.props.isOnline && <FontAwesomeIcon icon={faMicrophoneSlash}/>}
                      </td>
                      <td className="fs-xs ta-c">Nodes: {Evaluation.getNodes(evaluation)}</td>
                      <td className="fs-xs ta-c">Time: {Evaluation.getTime(evaluation)}</td>
                      <td className="fs-xs ta-c">Tb hits: {Evaluation.getTbHits(evaluation)}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>}

                {evaluation &&
                <div className="pv-holder">
                    {this.prepareEvaluation(evaluation[LINE_MAP.pv], this.props.fen).map((move, index) => {
                        return (
                            <span className="pv-holder__move" key={index}>{move}</span>
                        )
                    })}
                </div>
                }
            </React.Fragment>
        )
    }

    render() {


        if (this.props.evaluation.length === 0 || !this.props.settings.showEvaluation) {
            return null
        }
        return this.props.evaluation.map((evaluation) => this.renderLine(evaluation));
    }


    static getScore(evaluation: IEvaluation, onMove: IOnMove, isFlip: boolean) {
        let score = Number(evaluation[LINE_MAP.score]);

        if (evaluation[LINE_MAP.mate]) {
            return `#${Number(evaluation[LINE_MAP.mate])}`;
        }

        if (!isYourMove(onMove, isFlip)) {
            score *= (-1);
        }

        if (score >= 0) {
            return `+${score}`;
        }

        return score;
    }

    static getNodes(evaluation: IEvaluation) {
        return Evaluation.formatNumber(evaluation[LINE_MAP.nodes]);

    }

    static getTime(evaluation: IEvaluation) {
        if (evaluation[LINE_MAP.time]) {
            const time = Number(evaluation[LINE_MAP.time]) / 1000;
            return `${time.toFixed(0)}s`;
        }
        return 0;

    }

    static getTbHits(evaluation: IEvaluation) {
        return Evaluation.formatNumber(evaluation[LINE_MAP.tbhits]);
    }


    static formatNumber(num: number | string | undefined) {
        if (num) {
            const n = Number(num);

            let _num = 1000000 * 1000;
            if (n > _num) {
                const d = n / _num;
                return `${d.toFixed(2)}B`;
            }

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
        return 0;
    }

}