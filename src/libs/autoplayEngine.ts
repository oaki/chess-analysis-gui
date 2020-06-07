import store from "../store";
import {IOnMove} from "../actions";
import {IOpeningMove} from "../components/openingExplorer/openingExplorerReducers";
import {treeService} from "../components/moveTree/tree";
import {setMove} from "../components/history/historyReducers";
import {IEvaluation, LINE_MAP} from "../interfaces";
import {splitPv} from "../components/evaluation/evaluation";
import {getMoveFen} from "./moveFen";

const debounce = require("lodash/debounce");

export class AutoplayService {
    private store;

    constructor() {
        this.store = store;
        const debounceListener = debounce(this.storeListener, 300);
        store.subscribe(debounceListener);
    }

    private storeListener = () => {
        const state: any = this.store.getState();

        // check if autoplay is enabled
        if (state.autoplay && state.loading === false) {
            // check who is on move
            if (AutoplayService.isAiOnMove(state)) {
                const openingMove = this.getOpeningMove(state.openingMoves);
                if (openingMove) {
                    this.dispatchOpeningMove(openingMove, state.fen);
                } else if (state.evaluation.length > 0) {
                    console.log("check engine evaluation");
                    this.dispatchEngineMove(state.evaluation[0], state.fen);
                }

            }
        }
    }

    private dispatchOpeningMove(openingMove: IOpeningMove, fen: string) {

        const moveObj = getMoveFen(fen, openingMove.move);

        this.store.dispatch(setMove({
            from: moveObj.from,
            to: moveObj.to,
            id: treeService.getCounter(),
            fen: fen
        }));
    }


    private isScoreHigh(evaluation: IEvaluation) {

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

    private dispatchEngineMove(evaluation: IEvaluation, fen: string) {

        const isImported = evaluation[LINE_MAP.import];
        const pv = evaluation[LINE_MAP.pv];
        const nodes = Number(evaluation[LINE_MAP.nodes]);
        // const requiredTime = 20 * 1000;// @todo based on level

        if (this.isScoreHigh(evaluation)) {
            console.log("isScoreHigh", {evaluation});
        }

        // console.log({evaluation});
        if (isImported === 1
            || nodes > 80 * 1000 * 1000
            || this.isScoreHigh(evaluation)
        ) {

            const moves = splitPv(pv);
            const firstMove = moves[0];

            // console.log("dispatchEngineMove", {firstMove, time});
            const moveObj = getMoveFen(fen, firstMove);

            this.store.dispatch(setMove({
                from: moveObj.from,
                to: moveObj.to,
                id: treeService.getCounter(),
                fen: fen
            }));
        }
    }

    private getOpeningMove(openingMoves: IOpeningMove[]) {
        if (openingMoves.length === 0) {
            return null;
        }

        const sumWeight: Number = openingMoves.reduce((sum: number, move: IOpeningMove) => {
            return sum + move.weight;
        }, 0);

        const average: Number = Math.ceil(Number(sumWeight) / openingMoves.length);

        const possibleMoves = openingMoves.filter((move: IOpeningMove) => move.weight >= average);
        const selectedMove = this.randomItem(possibleMoves);

        return selectedMove;

    }

    private randomItem(items: any[]) {
        return items[Math.floor(Math.random() * items.length)];
    }

    static isAiOnMove(state): boolean {
        if ((state.onMove === IOnMove.WHITE && state.isFlip)
            ||
            (state.onMove === IOnMove.BLACK && !state.isFlip)
        ) {
            return true;
        }

        return false;
    }
}