import type { MouseEvent } from "react";
import { IOnMove, ISetMoveProps, SET_PROMOTION_DIALOG } from "../../actions";
import { IAction } from "../../interfaces";

export type IShowPromotionDialogProps = {
  requestedParams?: ISetMoveProps;
  isOpen: boolean;
}

export type IPromotingDialogProps = IShowPromotionDialogProps & {
  onMove: IOnMove;
  handleOnClick: (e: MouseEvent<HTMLElement>) => void;
}

export function setPromotionDialog(props: IShowPromotionDialogProps) {
  return {
    payload: props,
    type: SET_PROMOTION_DIALOG
  };
}


export const promotionDialogReducer = (promotionDialog: IShowPromotionDialogProps = { isOpen: false }, action: IAction<IShowPromotionDialogProps>) => {
  switch (action.type) {
    case SET_PROMOTION_DIALOG:
      return action.payload;

    default:
      return promotionDialog;
  }
};
