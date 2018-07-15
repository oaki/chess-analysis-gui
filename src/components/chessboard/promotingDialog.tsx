import * as React from "react";
import {IOnMove, ISetMoveProps, SET_PROMOTION_DIALOG} from "../../actions";
import {IAction} from "../../interfaces";

const classNames = require("classnames");
declare global {
    namespace JSX {
        interface IntrinsicElements {
            piece: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}


export const PromotingDialog = (props: IPromotingDialogProps) => {
    console.log("props", props);
    if (!props.isOpen) {
        return null;
    }

    const onMoveClass = props.onMove === IOnMove.WHITE ? "white" : "black";
    return (
        <div className="promotion__dialog">
            <div className="promotion__pieces">
                <a href="#" onClick={props.handleOnClick} className="promotion__href" data-piece="q">
                    <piece className={`${onMoveClass} queen`}/>
                </a>
                <a href="#" onClick={props.handleOnClick} className="promotion__href" data-piece="r">
                    <piece className={`${onMoveClass} rook`}/>
                </a>
                <a href="#" onClick={props.handleOnClick} className="promotion__href" data-piece="b">
                    <piece className={`${onMoveClass} bishop`}/>
                </a>
                <a href="#" onClick={props.handleOnClick} className="promotion__href" data-piece="n">
                    <piece className={`${onMoveClass} knight`}/>
                </a>
            </div>
        </div>
    )
}

export interface IShowPromotionDialogProps {
    requestedParams?: ISetMoveProps;
    isOpen: boolean;
}

export interface IPromotingDialogProps extends IShowPromotionDialogProps {
    onMove: IOnMove;
    handleOnClick: (e: any) => {}
}

export function setPromotionDialog(props: IShowPromotionDialogProps) {
    return {
        payload: props,
        type: SET_PROMOTION_DIALOG
    };
}


export function isPromoting(from: string, to: string, chess: any) {
    // is it a promotion?
    const source_rank = from.substring(2, 1);
    const target_rank = to.substring(2, 1);
    const piece = chess.get(from).type;
    return (piece === "p" &&
        ((source_rank === "7" && target_rank === "8") || (source_rank === "2" && target_rank === "1")));
}


export const promotionDialogReducer = (promotionDialog: IShowPromotionDialogProps = {isOpen: false}, action: IAction<IShowPromotionDialogProps>) => {
    switch (action.type) {
        case SET_PROMOTION_DIALOG:
            return action.payload;

        default:
            return promotionDialog;
    }
};
