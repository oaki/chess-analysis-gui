import {store} from "../store";

const filter = require("lodash/filter");
const find = require("lodash/find");


export function toDests(chess: any) {
    const dests = {};
    chess.SQUARES.forEach(s => {
        const ms = chess.moves({square: s, verbose: true});
        if (ms.length) dests[s] = ms.map(m => m.to);
    });
    return dests;
}

export function toColor(chess: any) {
    return (chess.turn() === "w") ? "white" : "black";
}

export function getHistory() {
    return store.getState()["history"];
}

export function getLastMove(): number {
    return store.getState()["lastMoveId"]
}

