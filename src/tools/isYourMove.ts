import {IOnMove} from "../actions";

export function isYourMove(onMove: IOnMove, isFlip: boolean) {
    return onMove === IOnMove.WHITE && !isFlip || onMove === IOnMove.BLACK && isFlip;
}