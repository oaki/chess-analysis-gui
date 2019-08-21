import {IEvaluation, LINE_MAP} from "../interfaces";
import {countPieces} from "../tools/countPieces";

export interface CheckEvaluationOptions {
    useScore: boolean;
}

export const saveCriterium = {
    // depth: 28,
    nodes: 80 * 1000 * 1000, //27 666 454 250 e.g. 1 629 921 584
    maxScore: 2.5,
};

export function checkEvaluation(fen: string, evaluation: IEvaluation, options: CheckEvaluationOptions = {useScore: true}) {
    const depth: number = Number(evaluation[LINE_MAP.depth]);
    const nodes = Number(evaluation[LINE_MAP.nodes]);
    const score = Math.abs(Number(evaluation[LINE_MAP.score]));
    const piecesCount = countPieces(fen);
    const isMate = !!evaluation[LINE_MAP.mate];

    if (
        piecesCount > 7
        // && depth > this.saveCriterium.depth
        && !isMate
        && (
            nodes >= saveCriterium.nodes
            || evaluation[LINE_MAP.import]
        )
        && (!options.useScore || score < saveCriterium.maxScore)
        && !!evaluation[LINE_MAP.pv]
    ) {
        return true;
    }
    return false;
}