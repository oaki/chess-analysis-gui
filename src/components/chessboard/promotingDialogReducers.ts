import {IOnMove, ISetMoveProps, SET_PROMOTION_DIALOG} from "../../actions";
import {IAction} from "../../interfaces";

export interface IShowPromotionDialogProps {
    requestedParams?: ISetMoveProps;
    isOpen: boolean;
}

export interface IPromotingDialogProps extends IShowPromotionDialogProps {
    onMove: IOnMove;
    handleOnClick: (e: any) => void;
}

export function setPromotionDialog(props: IShowPromotionDialogProps) {
    return {
        payload: props,
        type: SET_PROMOTION_DIALOG
    };
}





export const promotionDialogReducer = (promotionDialog: IShowPromotionDialogProps = {isOpen: false}, action: IAction<IShowPromotionDialogProps>) => {
    switch (action.type) {
        case SET_PROMOTION_DIALOG:
            return action.payload;

        default:
            return promotionDialog;
    }
};
