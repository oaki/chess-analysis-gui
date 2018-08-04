import * as Chess from "chess.js";

export function getMoveFen(previousFen: string, move: string) {

    const promotion = move.length > 4 && move.substring(4, 5);
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    const chess = new Chess(previousFen);
    const isMove = chess.move({
        from,
        to,
        promotion
    });

    if (!isMove) {
        throw new Error(`Invalid move ${move}`);
    }

    const fen = chess.fen();

    return {
        fen,
        from,
        to,
        promotion
    }
}