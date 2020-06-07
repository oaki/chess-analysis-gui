import * as React from "react";
import {FC, memo} from "react";
import {IEvaluation, IState, LINE_MAP} from "../../interfaces";
import {shallowEqual, useSelector} from "react-redux";

import * as Chess from "chess.js";

const ChessInstance = new Chess();
export interface Evaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface EvalHeaderProps {
    name: string;
    evaluation: IEvaluation;
}

export const EvalHeader = memo((props: EvalHeaderProps) => {
    return (
        <div className="evaluation-info">
            <table>
                <tbody>
                <tr>
                    <td className="fs-xs ta-c">
                        {props.name}
                    </td>
                    <td className="fs-xs ta-c">Nodes: {getNodes(props.evaluation)}</td>
                    <td className="fs-xs ta-c">Time: {getTime(props.evaluation)}</td>
                    <td className="fs-xs ta-c">Tb hits: {getTbHits(props.evaluation)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
});

interface EvalLineProps {
    evaluation: IEvaluation;
    fen: string;
}

const EvalLine = memo((props: EvalLineProps) => {
    const time1 = performance.now();
    const moves = prepareEvaluation(props.evaluation[LINE_MAP.pv], props.fen);
    const time2 = performance.now();
    console.log('EvalLine', time2-time1);
    return (
        <div className={"d-f pb-xxs"}>
            <div className={"fs-sm"}>{getScore(props.evaluation)}</div>
            <div className="pv-holder">
                {moves.map((move, index) => {
                    return (
                        <span className="pv-holder__move" key={index}>{move}</span>
                    )
                })}
            </div>
        </div>

    );
});

interface SmartEvaluationProps {
    name: string;
}

export const SmartEvaluation = memo((props: SmartEvaluationProps) => {
        const {fen, evaluations} = useSelector((state: IState) => ({
            fen: state.fen,
            evaluations: state.evaluation
        }), shallowEqual);
        return <Eval evaluations={evaluations} fen={fen} name={props.name}/>;
    }
);

type EvalProps = {
    evaluations: IEvaluation[];
    name: string;
    fen: string;
}
export const Eval: FC<EvalProps> = memo(({evaluations, name, fen}) => {

        return (
            <div>
                {evaluations[0] && <EvalHeader name={name} evaluation={evaluations[0]}/>}

                <div>
                    {evaluations.map((evaluation) => (
                        <EvalLine fen={fen} evaluation={evaluation} key={evaluation[LINE_MAP.pv]}/>))}
                </div>
            </div>
        );
    }
);


export function getScore(evaluation: IEvaluation) {
    let score = Number(evaluation[LINE_MAP.score]);

    if (evaluation[LINE_MAP.mate]) {
        return `#${Number(evaluation[LINE_MAP.mate])}`;
    }

    return score;
}

export function getNodes(evaluation: IEvaluation) {
    return formatNumber(evaluation[LINE_MAP.nodes]);
}

export function getTime(evaluation: IEvaluation) {
    if (evaluation[LINE_MAP.time]) {
        const time = Number(evaluation[LINE_MAP.time]) / 1000;
        return `${time.toFixed(0)}s`;
    }
    return 0;

}

function getTbHits(evaluation: IEvaluation) {
    return formatNumber(evaluation[LINE_MAP.tbhits]);
}


function formatNumber(num: number | string | undefined) {
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

export function splitPv(pv: string) {
    return pv.split(" ");
}

function prepareEvaluation(pv: string, fen: string) {
    // const chess = new Chess(fen);
    ChessInstance.load(fen);

    const moves = splitPv(pv);

    const newMoves: any = [];
    if (moves && moves.length > 0) {
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const newMove = ChessInstance.move(move, {sloppy: true});
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