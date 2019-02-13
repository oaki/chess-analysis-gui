import store from "../store";
import {IOnMove} from "../actions";
import {IOpeningMove} from "../components/openingExplorer/openingExplorerReducers";
import {treeService} from "../components/moveTree/tree";
import {setMove} from "../components/history/historyReducers";
import {IEvaluation, LINE_MAP} from "../interfaces";
import {Evaluation} from "../components/evaluation";
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

    private dispatchEngineMove(evaluation: IEvaluation, fen: string) {

        const isImported = evaluation[LINE_MAP.import];
        const isMate = evaluation[LINE_MAP.mate];
        const pv = evaluation[LINE_MAP.pv];
        const time = Number(evaluation[LINE_MAP.time]);
        const requiredTime = 20 * 1000;// @todo based on level
        const mateTime = 3 * 1000;// @todo based on level

        // console.log({evaluation});
        if (isImported === 1 || time > requiredTime || (isMate && mateTime > time)) {

            const moves = Evaluation.splitPv(pv);
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