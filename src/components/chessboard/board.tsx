import { useRefCallback } from "../hooks/useRefCallback";
import { useCallback, useEffect, useState } from "react";
import { Chessground } from "chessground";
import { toDests } from "../../libs/chessboardUtils";
import { AutoplayService } from "../../libs/autoplayEngine";
import * as Chess from "chess.js";
import { Api } from "chessground/api";
import store from "../../store";
import { setMove } from "../history/historyReducers";
import { treeService } from "../moveTree/tree";
import { IUser } from "../../reducers";
import { SessionManagerService } from "../../services/sessionManager";
import { ApiManagerService } from "../../services/apiManager";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { Undef } from "interfaces";

const playOtherSide = (cg: Api) => {
  return (orig, dest) => {
    store.dispatch(setMove({
      from: orig,
      to: dest,
      id: treeService.getCounter(),
      fen: (cg.state as any).fen
    }));
  };
};

export function useBoard(): [(node: HTMLDivElement) => void, Undef<Api>] {
  const [node, setRef] = useRefCallback<HTMLDivElement>();
  const [board, setBoard] = useState<Api>();

  useEffect(() => {
    if (node && !board) {
      const chessGround = Chessground(node, {
        orientation: "white",
        highlight: {
          check: true,
          lastMove: true
        },
        addPieceZIndex: true,
        movable: {
          free: false,
          dests: toDests(new Chess())
        }
      });

      chessGround.redrawAll();

      chessGround.set({
        movable: {
          events: {
            after: playOtherSide(chessGround)
          }
        }
      });

      setBoard(chessGround);

      initHistorySaving();
      new AutoplayService();
    }
  }, [board, node]);

  const onResize = useCallback(() => {
    return debounce(() => {
      board?.redrawAll();
    }, 100);
  }, [board]);

  useEffect(() => {
    if (board) {
      window.addEventListener("resize", onResize(), true);
      return () => {
        window.addEventListener("resize", onResize(), true);
      };
    }

  }, [board, onResize]);

  return [
    setRef,
    board
  ];

}


function initHistorySaving() {
  // auto saving for history
  let previousHash: string = treeService.getStateHash();

  const saveHistory = throttle(() => {
    const history = store.getState()["history"];
    const user: IUser = store.getState()["user"];
    const token = SessionManagerService.getToken();
    if (user.lastGameId && token) {
      ApiManagerService.saveGame(history, user.lastGameId, token);
    }
  }, 1000);

  function handleHistoryChange() {

    let currentHash = treeService.getStateHash();

    if (previousHash !== currentHash) {
      saveHistory();
    }
    previousHash = currentHash;
  }

  store.subscribe(handleHistoryChange);
}