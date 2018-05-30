import {store} from "../store";
import {IHistoryMove} from "../components/AwesomeChessboard";
import {sortBy, first, find, filter} from 'lodash';


export function toDests(chess: any) {
    const dests = {};
    chess.SQUARES.forEach(s => {
        const ms = chess.moves({square: s, verbose: true});
        if (ms.length) dests[s] = ms.map(m => m.to);
    });
    return dests;
}

export function toColor(chess: any) {
    return (chess.turn() === 'w') ? 'white' : 'black';
}

export function getHistory() {
    return store.getState()['history'];
}

export function getHistoryMove(uuid: string): IHistoryMove {
    return getHistory()[uuid];
}

export function getLastMove(): string {
    return store.getState()['lastMoveId']
}

export function getHistoryPreviousMove(): IHistoryMove {
    const history = getHistory();
    const lastMoveId = store.getState()['lastMoveId'];
    const parentId = getHistory()[lastMoveId].parentId;
    return history[parentId];
}

export function getHistoryChildren(id: string = ''): IHistoryMove[] {
    const history = getHistory();
    const lastMoveId = id || getLastMove();

    const moves = filter(history, (move: IHistoryMove) => {
        return move.parentId === lastMoveId;
    });

    return moves;
}

export function getHistoryNextMove(id: string = ''): IHistoryMove {
    const children: IHistoryMove[] = getHistoryChildren();
    const move = find(getHistoryChildren(), (move) => move.isMain);
    if (move) {
        return move;
    }

    return children[0];
}

export function getHistoryTree() {
    const buffer = [];
    getHistoryLine2('', buffer);
    return buffer;
}

export function getHistoryLine2(parentId: string = '', buffer: IHistoryMove[]) {
    const children: IHistoryMove[] = getHistoryChildren();
    
}



export function getHistoryParents(uuid: string): IHistoryMove[] {
    const history: any = getHistory();
    const output: IHistoryMove[] = [];
    let parentId = uuid;
    let counter = 0;

    while (parentId !== '' && counter < 500) {
        const move = history[parentId];
        if (!move) {
            break;
        }
        output.push(move);
        parentId = move.parentId;
        counter++;
    }

    return output;
}

export function getHistoryLine() {
    const history: any = getHistory();
    const output: any = [];
    let parentId = '';
    let counter = 0;

    while (counter < 500) {
        const move = find(history, (move) => {
            return move.parentId === parentId;
        });
        if (!move) {
            break;
        }
        output.push(move);
        parentId = move.uuid;
        counter++;
    }

    return output;
}