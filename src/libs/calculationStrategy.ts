import {IEvaluation, LINE_MAP} from "../interfaces";

export enum CalculationStrategy {
    localEngine = "localEngine",
    server = "server",
}

export function selectCalculationStrategy(evaluation: IEvaluation) {
    const time = Number(evaluation[LINE_MAP.time]) / 1000;
    const score = Number(evaluation[LINE_MAP.score]);
    const toMate = Math.abs(Number(evaluation[LINE_MAP.mate]));

    if (score > 8 && time > 3) {
        return true;
    }

    if (score > 7 && time > 4) {
        return true;
    }

    if (score > 6 && time > 5) {
        return true;
    }

    if (score > 5 && time > 7) {
        return true;
    }

    if (score > 4 && time > 8) {
        return true;
    }

    if (score > 3 && time > 10) {
        return true;
    }

    if (toMate > 0 && toMate < 6) {
        return true;
    }

    if (toMate > 0 && toMate < 11 && time > 3) {
        return true;
    }

    if (toMate > 0 && toMate < 18 && time > 6) {
        return true;
    }


    return false;

}