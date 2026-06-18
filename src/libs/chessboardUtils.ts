import { Chess, SQUARES } from "chess.js";
import type { Key } from "chessground/types";

export function toDests(chess: InstanceType<typeof Chess>) {
    const dests: Record<string, Key[]> = {};
    SQUARES.forEach(s => {
        const ms = chess.moves({square: s, verbose: true});
        if (ms.length) dests[s] = ms.map(m => m.to as Key);
    });
    return dests;
}

export function toColor(chess: InstanceType<typeof Chess>) {
    return (chess.turn() === "w") ? "white" : "black";
}

