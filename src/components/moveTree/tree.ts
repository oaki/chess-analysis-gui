import guid from "../../tools/uuid";
import {IEvaluation, Nullable} from "../../interfaces";

export enum NODE_MAP {
    id = "id",
    fen = "f",
    move = "m",
    variant = "v",
    variants = "vs",
    moves = "ms",
    shortNotation = "s",
    evaluation = "e",
}

export interface Node {
    [NODE_MAP.id]: number;
    [NODE_MAP.fen]: string; //move number
    [NODE_MAP.move]: string;
    [NODE_MAP.shortNotation]: string;
    [NODE_MAP.variants]: NodeVariant[];
    [NODE_MAP.evaluation]?: IEvaluation[];
}


export interface NodeVariant {
    [NODE_MAP.variant]: string;
    [NODE_MAP.moves]: Node[];
}

export class Tree {
    private counter: number = 0;
    private nodes: Node[] = [];
    private cache = {}; //not used yet
    private stateHash: string = '';

    setNodes(nodes: Node[]) {
        this.nodes = JSON.parse(JSON.stringify(nodes));

        let idCounter = 0;
        this.iterate(this.nodes, (node: Node) => {
            if (node && idCounter < node.id) {
                idCounter = node.id;
            }
        });

        this.setCounter(idCounter);

        this.generateNewState();
    }

    generateNewState() {
        this.stateHash = guid();
    }

    getStateHash() {
        return this.stateHash;
    }


    toString() {
        return JSON.stringify(this.nodes);
    }

    toJson(): Node[] {
        return this.nodes;
    }

    getNextMoveId(parentId: number, newFen: string): number | null {
        const ref: ReferenceToMove = treeService.getReference(parentId);
        if (ref.parent && ref.parent[ref.index + 1]) {
            if (ref.parent[ref.index + 1][NODE_MAP.fen] === newFen) {
                return ref.parent[ref.index + 1][NODE_MAP.id];
            } else {
                if (ref.parent[ref.index + 1][NODE_MAP.variants]) {
                    const variant: NodeVariant | undefined = ref.parent[ref.index + 1][NODE_MAP.variants].find((variant: NodeVariant) =>
                        variant[NODE_MAP.moves] && variant[NODE_MAP.moves][0] && variant[NODE_MAP.moves][0][NODE_MAP.fen] === newFen);

                    if (variant) {
                        return variant[NODE_MAP.moves][0][NODE_MAP.id];
                    }
                }
            }

        }

        return null;
    }

    add(node: Node, parentId: number): ReferenceToMove {
        const ref: ReferenceToMove = this.getReference(parentId);

        return this.addWithRef(node, ref);
    }

    addNewVariant(variants: NodeVariant[], node: Node): ReferenceToMove {
        variants.push({
            [NODE_MAP.variant]: node[NODE_MAP.move],
            [NODE_MAP.moves]: [node]
        });

        this.generateNewState();

        return {
            isLast: true,
            index: 0,
            node: variants[variants.length - 1][NODE_MAP.moves][0],
            parent: variants[variants.length - 1][NODE_MAP.moves]
        };
    }

    addWithRef(node: Node, ref: ReferenceToMove): ReferenceToMove {
        if (ref.isLast) {
            ref.parent.push(node);
            this.generateNewState();
        } else if (ref && ref.node) {

            // if node is not last it means that there is another node after
            const nextMove = ref.parent[ref.index + 1];
            return this.addNewVariant(nextMove[NODE_MAP.variants], node)
        }

        const index = ref.parent.length - 1;
        return {
            isLast: true,
            index: index,
            node: ref.parent[index],
            parent: ref.parent
        };
    }

    getPrevMove(id: number): Node {
        const ref = this.getReference(id);

        return ref.parent[ref.index - 1];
    }

    getNextMove(id: number): Node {

        const ref = this.getReference(id);

        // if it's last return same
        if (ref.index === ref.parent.length - 1 && ref.node) {
            return ref.node;
        } else {

            if (ref.parent[ref.index + 1]) {
                return ref.parent[ref.index + 1];
            } else {
                return ref.parent[ref.index];
            }

        }
    }

    getCounter() {
        this.counter++;
        return this.counter;
    }

    setCounter(num: number) {
        this.counter = num;
    }


    private findReference(moveRef: ReferenceToMove, moves: Node[], id: number, parentId: Nullable<number> = null): void {

        for (let i = 0; i < moves.length; i++) {
            const move: Node = moves[i];
            if (move.id === id) {
                moveRef.isLast = moves.length - 1 === i;
                moveRef.node = moves[i];
                moveRef.parent = moves;
                moveRef.index = i;
                break;
            } else {

                for (let j = 0; j < move[NODE_MAP.variants].length; j++) {
                    const variant: NodeVariant = move[NODE_MAP.variants][j];
                    this.findReference(moveRef, variant[NODE_MAP.moves], id, move[NODE_MAP.id]);
                }
            }
        }
    }


    public iterate(moves: Node[], callback: (node: Node) => void) {
        for (let i = 0; i < moves.length; i++) {
            const move: Node = moves[i];
            callback(move);

            if (move[NODE_MAP.variants] && move[NODE_MAP.variants].length > 0) {
                for (let j = 0; j < move[NODE_MAP.variants].length; j++) {
                    const variant: NodeVariant = move[NODE_MAP.variants][j];
                    this.iterate(variant[NODE_MAP.moves], callback);
                }
            }
        }
    }


    getReference(id: number):ReferenceToMove {
        const ref: ReferenceToMove = {
            node: null,
            parent: this.nodes,
            isLast: true,
            index: -1
        };
        this.findReference(ref, this.nodes, id);

        return ref;
    }

    private findReferenceByFen(list: any[], moves: Node[], fen: string): void {

        for (let i = 0; i < moves.length; i++) {
            const move: Node = moves[i];
            if (move[NODE_MAP.fen] === fen) {
                list.push(move);
            } else {
                for (let j = 0; j < move[NODE_MAP.variants].length; j++) {
                    const variant: NodeVariant = move[NODE_MAP.variants][j];
                    this.findReferenceByFen(list, variant[NODE_MAP.moves], fen);
                }
            }
        }
    }

    findReferencesByFen(fen: string) {
        const list = [];
        this.findReferenceByFen(list, this.nodes, fen);
        return list;
    }

}


export const treeService = new Tree();

interface ReferenceToMove {
    node: Node | null;
    parent: Node[];
    isLast: boolean;
    index: number;
}