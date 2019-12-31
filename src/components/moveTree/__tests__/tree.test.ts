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
        if (!ref.node) {
            throw "node is not found";
        }
        expect(ref.node[NODE_MAP.id]).toEqual(35);
    })

    test("getNextMoveId -> next move is not exist", () => {
        treeService.setNodes(mock as any);

        const nextMoveId = treeService.getNextMoveId(35, "rnbqkb1r/pppp1ppp/8/4P3/2P1n3/8/PP2PPPP/RNBQKBNR w KQkq - 1 4");
        expect(nextMoveId).toEqual(null);
    })

    test("getNextMoveId -> next move exist", () => {
        treeService.setNodes(mock as any);

        const nextMoveId = treeService.getNextMoveId(32, "rnbqkb1r/pppp1ppp/5n2/4P3/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3");
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
        expect(nextMove && nextMove[NODE_MAP.id]).toEqual(34);
    });

    test("getNextMove - default position - get first move", () => {
        treeService.setNodes(mock as any);

        const nextMove = treeService.getNextMove(-1);
        expect(nextMove && nextMove[NODE_MAP.id]).toEqual(1);
    });

    test("getNextMove - if it's last return undefined - main line", () => {
        treeService.setNodes(mock as any);

        const nextMove = treeService.getNextMove(6);
        expect(nextMove).toEqual(undefined);
    });

    test("getNextMove - if it's last return undefined - nested line", () => {
        treeService.setNodes(mock as any);

        const nextMove2 = treeService.getNextMove(35);
        expect(nextMove2).toEqual(undefined);
    });

    test("getPrevMove - default", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(6);
        expect(prevMove && prevMove[NODE_MAP.id]).toEqual(5);
    });

    test("getPrevMove - main line - prev is not exist", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(1);
        expect(prevMove).toEqual(undefined);
    });

    test("getPrevMove - nested line - prev is exist", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(34);
        expect(prevMove && prevMove[NODE_MAP.id]).toEqual(33);
    });

    test("getPrevMove - nested line - prev exist but it's first variant", () => {
        treeService.setNodes(mock as any);

        const prevMove = treeService.getPrevMove(35);
        expect(prevMove && prevMove[NODE_MAP.id]).toEqual(33);
    });

    test("parsePath - empty path", () => {
        treeService.setNodes(mock as any);

        const pathParts = treeService.parsePath("");
        expect(pathParts.index).toEqual(-1);
        expect(pathParts.prefix).toEqual("");
        expect(pathParts.parts).toEqual([]);
        expect(pathParts.moves.length).toEqual(6);
    });

    test("parsePath - path - first level", () => {
        treeService.setNodes(mock as any);

        const pathParts = treeService.parsePath("3");
        expect(pathParts.index).toEqual(3);
        expect(pathParts.prefix).toEqual("");
        expect(pathParts.parts).toEqual(["3"]);
        expect(pathParts.moves.length).toEqual(6);
    });

    test("parsePath - path - with variants", () => {
        treeService.setNodes(mock as any);
        const path = "3.vs.0.ms.2.vs.0.ms.3";
        const pathParts = treeService.parsePath(path);
        expect(pathParts.index).toEqual(3);
        expect(pathParts.prefix).toEqual("3.vs.0.ms.2.vs.0.ms");
        expect(pathParts.parts).toEqual(path.split("."));
        expect(pathParts.moves.length).toEqual(1);
    });

    test("getMoveLine", () => {
        treeService.setNodes(mock as any);
        const line = treeService.getMoveLine(33);
        expect(line).toEqual(3);
    });
})