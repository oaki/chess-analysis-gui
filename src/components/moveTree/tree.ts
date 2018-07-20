interface Node {
    id: number;
    num: number; //move number
    move: string;
    path: string;
    moves?: Node[];
    variants?: Node[];
    level?: number;
}

export class Tree {
    private flatTree: any[] = [];
    private nodes: Node[] = [
        {
            id: 0, num: 0, move: "d2d4", path: "", moves: [
                {id: 1, num: 1, move: "d7d5", path: ""},
                {
                    id: 2, num: 2, move: "c2c4", path: "",
                    variants: [
                        {
                             moves: [
                                 {id: 3, num: 2, move: "g1f3", path: "2/3"},
                                {id: 5, num: 3, move: "g8f6", path: "2/3"},
                                {id: 6, num: 4, move: "c2c4", path: "2/3"},
                                {
                                    id: 7, num: 5, move: "c7c6", path: "2", variants: [
                                        {
                                            id: 32, num: 5, move: "g7g6", moves: [
                                                {id: 10, num: 4, move: "g2g3", path: "2/3/7"},
                                                {id: 102, num: 5, move: "f8g7", p: 5},
                                            ]
                                        }
                                    ]
                                },
                            ]
                        },

                        {
                            id: 32, num: 2, move: "b2c3", path: "2/32", moves: [
                                {id: 51, num: 3, move: "g8f6", path: "2/32/51"},
                            ]
                        }
                    ]
                },
            ]
        },

    ];


    add(node: Node, level, isNewVariant: boolean = false) {
        console.log({node, level});
        this.flatTree.push({
            level,
            isNewVariant,
            move: node.move,
        })

    }

    //
    // makeFlat(level) {
    //
    //     history.forEach((move) => {
    //         this.flatTree.push(move);
    //         if (move.variants && move.variants.length > 0) {
    //             this.flatTree.push({...move, level: 1});
    //             move.variants.forEach((submove) => {
    //
    //                 this.flatTree.push({...submove, level: 2});
    //
    //
    //             });
    //         }
    //
    //         if (move.moves && move.moves.length > 0) {
    //             move.moves.forEach((subsubmove) => {
    //                 this.flatTree.push({...subsubmove, level: 3});
    //             })
    //         }
    //
    //     });
    // }

    makeFlat(moves: Node[], level) {

        moves.forEach((move) => {
            this.add(move, level);

            if (move.variants && move.variants.length > 0) {

                move.variants.forEach((submove) => {

                    this.add(submove, level + 1, true);

                    if (submove.moves && submove.moves.length > 0) {
                        this.makeFlat(submove.moves, level + 1);
                    }
                });
            }

            if (move.moves && move.moves.length > 0) {
                this.makeFlat(move.moves, level + 1);
            }
        })

    }


    build() {
        this.makeFlat(this.nodes, 0);

        console.log("FLAT", this.flatTree);
        return this.flatTree;
    }
}