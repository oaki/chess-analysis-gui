import { IAction } from "../../interfaces";

export const MENU_TOGGLE_OPEN = "MENU_TOGGLE_OPEN";
export const MENU_OPEN_PGN_DIALOG = "MENU_OPEN_PGN_DIALOG";
export const FLIP_BOARD = "FLIP_BOARD";
export const AUTOPLAY = "AUTOPLAY";


export function flipBoard() {
  return {
    type: FLIP_BOARD
  };
}

export function toggleAutoplay(isAutoplay: boolean | null = null) {
  return {
    payload: { isAutoplay },
    type: AUTOPLAY
  };
}

export function toogleOpenMenu(isOpen: boolean | null = null) {
  return {
    payload: { isOpen },
    type: MENU_TOGGLE_OPEN
  };
}

export function openPgnDialog(isOpen: boolean = false) {
  return {
    payload: isOpen,
    type: MENU_OPEN_PGN_DIALOG
  };
}

export type IMenu = {
  isOpen: boolean;
}


type FlipBoardAction = ReturnType<typeof flipBoard> | { type: string };

export const flipBoardReducer = (isFlip: boolean = false, action: FlipBoardAction) => {
  switch (action.type) {
    case FLIP_BOARD:
      return !isFlip;

    default:
      return isFlip;
  }
};

type IAutoplay = {
  isAutoplay: boolean
}

export const autoplayReducer = (isAutoplay: boolean = false, action: IAction<IAutoplay>) => {
  switch (action.type) {
    case AUTOPLAY:
      return action.payload.isAutoplay === null ? !isAutoplay : action.payload.isAutoplay;

    default:
      return isAutoplay;
  }
};

export const menuReducer = (menu: IMenu = { isOpen: false }, action: IAction<Partial<IMenu>>) => {
  switch (action.type) {
    case MENU_TOGGLE_OPEN:
      const m = { ...menu };
      if (action.payload.isOpen) {
        m.isOpen = action.payload.isOpen;
      } else {
        m.isOpen = !m.isOpen;
      }

      return m;

    default:
      return menu;
  }
};


export const pgnDialogReducer = (isOpen: boolean = false, action: IAction<boolean>) => {
  switch (action.type) {
    case MENU_OPEN_PGN_DIALOG:
      return action.payload;

    default:
      return isOpen;
  }
};