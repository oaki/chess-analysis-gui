import {NODE_MAP, treeService} from "../tree";
import {mock} from "./mocks/tree";

describe("TreeServiceTree test", () => {
    test("findReferencesByFen", () => {
        treeService.setNodes(mock as any);

        const result = [{
            "e": [{
                "d": "22",
                "fen": "rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4",
                "h": "0",
                "m": false,
                "n": "95451797",
                "p": "a2a3",
                "s": "1.68",
                "t": "5001"
            }],
            "f": "rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4",
            "id": 35,
            "m": "f6e4",
            "s": "Ne4",
            "vs": []
        }];
        expect(treeService.findReferencesByFen("rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4")).toEqual(result);
    })

    test("getReference", () => {
        treeService.setNodes(mock as any);

        const ref = treeService.getReference(35);
        if(!ref.node){
            throw 'node is not found';
        }
        expect(ref.node[NODE_MAP.id]).toEqual(35);
    })

    test("getNextMoveId -> next move is not exist", () => {
        treeService.setNodes(mock as any);

        const nextMoveId = treeService.getNextMoveId(35, 'rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4');
        expect(nextMoveId).toEqual(null);
    })

    test("getNextMoveId -> next move exist", () => {
        treeService.setNodes(mock as any);

        const nextMoveId = treeService.getNextMoveId(32, 'rnbqkb1r/pppp1ppp/5n2/4P3/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3');
        expect(nextMoveId).toEqual(33);
    })

    test("add", () => {
        treeService.setNodes(mock as any);

        const referenceToMove = treeService.add({
            "id": 36,
            "f": "rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4",
            "m": "f6e4",
            "s": "Ne4",
            "vs": [],
            "e": []
        }, 35);
        expect(referenceToMove.index).toEqual(1);

        const referenceToMove2 = treeService.add({
            "id": 37,
            "f": "rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4",
            "m": "f6e4",
            "s": "Ne4",
            "vs": [],
            "e": []
        }, 36);
        expect(referenceToMove2.index).toEqual(2);
    })

    test("getNextMove - exist", () => {
        treeService.setNodes(mock as any);

        const nextMove = treeService.getNextMove(33);
        expect(nextMove[NODE_MAP.id]).toEqual(34);
    });

    test("getNextMove - if it's last return same - main line", () => {
        treeService.setNodes(mock as any);

        const nextMove = treeService.getNextMove(6);
        expect(nextMove[NODE_MAP.id]).toEqual(6);
    });

    test("getNextMove - if it's last return same - nested line", () => {
        treeService.setNodes(mock as any);
        
        const nextMove2 = treeService.getNextMove(35);
        expect(nextMove2[NODE_MAP.id]).toEqual(35);
    });

    test("getPrevMove", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(6);
        expect(prevMove[NODE_MAP.id]).toEqual(5);
    });

    test("getPrevMove - main line - prev is not exist", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(1);
        expect(prevMove).toEqual(undefined);
    });

    test("getPrevMove - nested line - prev is exist", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(34);
        expect(prevMove[NODE_MAP.id]).toEqual(33);
    });

    test("getPrevMove - nested line - prev is but it's first variant", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(35);
        expect(prevMove[NODE_MAP.id]).toEqual(33);
    });
})