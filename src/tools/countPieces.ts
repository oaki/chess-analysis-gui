export function countPieces(fen: string) {
    //example
    //3R4/6k1/5pP1/8/7P/8/r4PK1/8 b - h3 0 36
    // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
    const arr = fen.split(" ");
    const mainPart = arr[0];

    // 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'.match(/r|n|b|q|k|p|R|N|B|Q|K|P/g)
    const match = mainPart.match(/r|n|b|q|k|p|R|N|B|Q|K|P/g);

    if (!match) {
        return 0;
    }

    return match.length;

}