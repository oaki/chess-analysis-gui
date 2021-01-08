import guid from "../../tools/uuid";
import { IEvaluation, Nullable, Undef } from "../../interfaces";
import get from "lodash/get";
import { getBranchPath, getLastIndex, getPrefix } from "./treeUtils";
import { FIRST_POSITION } from "../../contants";

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

export const FIRST_ID = 0;
export const firstNode = {
  [NODE_MAP.id]: 0,
  [NODE_MAP.fen]: FIRST_POSITION,
  [NODE_MAP.move]: "",
  [NODE_MAP.shortNotation]: "",
  [NODE_MAP.variants]: [],
  [NODE_MAP.evaluation]: []
};

export class Tree {
  //unique counter for each move, basicly it's a id
  private counter: number = 0;

  // keep all nodes (tree)
  private nodes: Node[] = [];

  private stateHash: string = "";

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

  add(node: Node, parentId: number): ReferenceToMove {
    console.log("add", node, parentId);
    const ref: ReferenceToMove = this.getReference(parentId);
    const newRef = this.addWithRef(node, ref);
    this.generateNewState();
    return newRef;
  }

  addNewVariant(variants: NodeVariant[], node: Node): ReferenceToMove {
    variants.push({
      [NODE_MAP.variant]: node[NODE_MAP.move],
      [NODE_MAP.moves]: [node]
    });

    this.generateNewState();

    return {
      index: 0,
      node: variants[variants.length - 1][NODE_MAP.moves][0],
      path: "todo"
    };
  }

  addWithRef(node: Node, ref: ReferenceToMove): ReferenceToMove {
    const pathParts = this.parsePath(ref.path);
    if (pathParts.prefix === null || pathParts.index === null) {
      throw new Error("prefix or index is null");
    }

    const moves = pathParts.prefix ? get(this.nodes, pathParts.prefix) : this.nodes;

    const nextMove = moves[pathParts.index + 1];

    // check if it's last move
    if (nextMove) {
      if (nextMove[NODE_MAP.fen] === node[NODE_MAP.fen]) {
        // next move is same as we have already
        return this.getReference(node[NODE_MAP.id]);
      } else {
        //add new variant
        return this.addNewVariant(nextMove[NODE_MAP.variants], node);
      }
    }
    // it was last so add as next move
    moves.push(node);

    return this.getReference(node[NODE_MAP.id]);
  }

  getPrevMove(id: number): Undef<Node> {
    const ref = this.getReference(id);
    const pathParts = this.parsePath(ref.path);

    if (pathParts.prefix === "" && pathParts.index === 0) {
      return undefined;
    }

    let newPath = getBranchPath(pathParts.parts.join("."));
    const lastIndex = getLastIndex(newPath);
    const prefix = getPrefix(newPath);

    // console.log({pathParts, newPath, lastIndex, prefix});
    newPath = prefix ? `${prefix}.${lastIndex - 1}` : String(lastIndex - 1);

    return get(this.nodes, newPath);
  }

  public parsePath(path: string): PathParts {
    //it's root move
    if (path === "") {
      return {
        prefix: "",
        index: -1,
        moves: this.nodes,
        parts: []
      };
    }

    let index = -1;
    let prefix = "";
    let parts: string[] = [];
    if (path.indexOf(".") === -1) {
      index = parseInt(path, 10);
      parts = [path];
    } else {
      parts = path.split(".");
      const length = parts.length;
      index = Number(parts[length - 1]);
      prefix = parts.slice(0, length - 1).join(".");
    }

    const moves = prefix === "" ? this.nodes : get(this.nodes, prefix);
    return { prefix, index, moves, parts };
  }

  getNextMove(id: number): Undef<Node> {

    if (id === -1 && this.nodes[0]) {
      return this.nodes[0];
    }

    const ref = this.getReference(id);

    if (!ref || !ref.node) {
      return;
    }

    const pathParts = this.parsePath(ref.path);
    const nextNode = pathParts.moves[pathParts.index + 1];
    if (nextNode) {
      return nextNode;
    }

    return;
  }

  // if next move is same then return that one
  // if not then
  getNextMoveId(previousId: number, newFen: string): Nullable<number> {
    const ref: ReferenceToMove = treeService.getReference(previousId);
    if (ref.path && ref.node) {

      //check next move if there is same FEN, return it
      const nextMove = this.getNextMove(previousId);
      if (nextMove && nextMove[NODE_MAP.fen] === newFen) {
        return nextMove[NODE_MAP.id];
      }

      //check all variants and first move if there is not same FEN
      const variants = ref.node[NODE_MAP.variants];
      if (variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const firstMove = variants[i][NODE_MAP.moves][0];
          if (firstMove && firstMove[NODE_MAP.fen] === newFen) {
            return firstMove[NODE_MAP.id];
          }
        }
      }
    }

    return null;
  }

  getCounter() {
    this.counter++;
    return this.counter;
  }

  setCounter(num: number) {
    this.counter = num;
  }

  private findReference(moveRef: ReferenceToMove, pathToMoves: string, moveId: number): void {

    const moves = pathToMoves ? get(this.nodes, pathToMoves) : this.nodes;
    for (let i = 0; i < moves.length; i++) {
      const move: Node = moves[i];
      const newPath = pathToMoves ? `${pathToMoves}.${i}` : `${i}`;
      if (move.id === moveId) {
        moveRef.node = moves[i];
        moveRef.path = newPath;
        moveRef.index = i;
        break;
      } else {
        for (let j = 0; j < move[NODE_MAP.variants].length; j++) {
          const newVariantPath = `${newPath}.${NODE_MAP.variants}.${j}.${NODE_MAP.moves}`;
          this.findReference(moveRef, newVariantPath, moveId);
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


  getReference(id: number): ReferenceToMove {
    const ref: ReferenceToMove = {
      node: firstNode,
      path: "0",
      index: 0
    };
    this.findReference(ref, "", id);

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

  // get move line - all previous moves
  getMoveLine(id: number): string {
    const ref = this.getReference(id);

    if (!ref.node) {
      return "";
    }
    const moves: string[] = [];

    let path = ref.path;
    let counter = 0;
    let useMinusOne = false;
    while (path && counter < 10) {
      let index = getLastIndex(path);

      if (useMinusOne) {
        index--;
        useMinusOne = false;
      }

      let prefix = getPrefix(path);

      for (let i = index; i >= 0; i--) {
        path = prefix ? `${prefix}.${i}` : `${i}`;
        const move = get(this.nodes, path);
        moves.push(move[NODE_MAP.move]);
      }

      if (getLastIndex(path) === 0) {
        path = getBranchPath(path);
        useMinusOne = true;
      }

      counter++;
    }

    return moves.reverse().join(" ");
  }

}

interface PathParts {
  prefix: string;
  index: number;
  moves: Node[];
  parts: string[];
}

export const treeService = new Tree();

interface ReferenceToMove {
  node: Nullable<Node>;
  path: string;
  index: number;
}