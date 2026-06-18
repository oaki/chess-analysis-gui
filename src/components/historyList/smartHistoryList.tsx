import { store } from "../../store";
import React, { memo, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../libs/stateCompat";
import { batchActions } from "../../libs/batchActions";
import { setEvaluation, setPosition, setUser } from "../../actions";
import { setSyzygyEvaluation } from "../syzygyExplorer/syzygyExplorerReducers";
import { IHistoryMove, lastMoveId, setHistory } from "../history/historyReducers";
import { setOpeningPosition } from "../openingExplorer/openingExplorerReducers";
import { FIRST_ID, Node } from "../moveTree/tree";
import { IHistoryGameResponse } from "./historyListReducers";
import { Undef } from "../../interfaces";
import { ReduxStateShape } from "../../reducers";
import { useFetch } from "../hooks/useFetch";
import { SessionManagerService } from "../../services/sessionManager";
import { config } from "../../config";
import { loadHistoryGames } from "../../layouts/historyPage";
import { formatDate } from "tools/formatDate";
import { ListItem } from "components/ui/listItem";
import { Move } from "components/historyList/move";
import { List } from "components/ui/list";

const HistoryList = memo(() => {
  const navigate = useNavigate();
  const [fetchState, doFetch] = useFetch();
  const historyList: IHistoryGameResponse[] = useSelector((reduxState: ReduxStateShape) => {
    return reduxState.historyList;
  });

  useEffect(() => {
    if (fetchState.response) {
      loadHistoryGames();
    }
  }, [doFetch, fetchState.response]);


  const handleDeleteGame = (id: string) => doFetch(`${config.apiHost}/user/history/${id}`, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SessionManagerService.getToken()}`
    })
  });

  const handleLoadGame = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const id: number = Number(e.currentTarget.dataset.id);
    const historyGameResponse: Undef<IHistoryGameResponse> = historyList.find((item: IHistoryGameResponse) => {
      return Number(item.id) === id;
    });

    if (historyGameResponse) {
      const user = store.getState()["user"];
      store.dispatch(batchActions([
        setUser(user),
        setHistory(historyGameResponse.moves as unknown as Node[]),
        lastMoveId(FIRST_ID),
        setPosition(""),
        setOpeningPosition([]),
        setEvaluation([]),
        setSyzygyEvaluation(null)
      ]));
    }
    navigate("/");
  };

  return (
    <List>
      {historyList.map((historyGame: IHistoryGameResponse): ReactElement =>
        <ListItem
          key={historyGame.id}
          id={String(historyGame.id)}
          handleClick={handleLoadGame}
          handleDelete={handleDeleteGame}
        >
          <div className="fs-xs">{formatDate(historyGame.updated_at)}</div>
          <div className="ox-a fs-xs">
            {historyGame.moves.slice(0, 15).map((move: IHistoryMove, index) => {
              return <Move key={move.id} move={move} index={index} />;
            })}
          </div>
        </ListItem>
      )}
    </List>
  );

});

export const SmartHistoryList = HistoryList;
