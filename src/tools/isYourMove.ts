import {IOnMove} from "../actions";

export function isYourMove(onMove: IOnMove, isFlip: boolean) {
    if (onMove === IOnMove.WHITE && !isFlip) {
        return true;
    }

    return Boolean(onMove === IOnMove.BLACK && isFlip);
}