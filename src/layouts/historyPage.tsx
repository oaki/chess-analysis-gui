import React, { FC, memo, useEffect } from "react";
import { MenuWithRouter } from "../components/menu/menu";
import { setLoading } from "../actions";
import { store } from "../store";
import { config } from "../config";
import { Header } from "../components/Header";
import { SmartHistoryList } from "../components/historyList/smartHistoryList";
import { setHistoryGameList } from "../components/historyList/historyListReducers";
import { Flash } from "../services/errorManager";
import { isHistoryGameResponseList } from "../libs/typeGuards";
import { SessionManagerService } from "../services/sessionManager";
import { StyledContentWrapper, StyledWrapperWithHeader } from "components/ui/styledWrapperWithHeader";

export const HistoryPage: FC = memo(() => {

  useEffect(() => {
    loadHistoryGames();
  }, []);

  return (
    <StyledWrapperWithHeader>
      <Header title="History" />
      <StyledContentWrapper>
          <SmartHistoryList />
      </StyledContentWrapper>
      <MenuWithRouter showMainMenu={true} />
    </StyledWrapperWithHeader>
  );
});


export async function loadHistoryGames() {
  const token = SessionManagerService.getToken();
  store.dispatch(setLoading(true));

  const url = `${config.apiHost}/user/history?offset=${Number(0)}&limit=${Number(10)}&order=DESC`;
  const headers: RequestInit = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    })
  };

  try {
    const response = await fetch(url, headers);
    if (!response.ok) {
      throw new Error("Loading failed");
    }

    const games: unknown = await response.json();
    store.dispatch(setHistoryGameList(isHistoryGameResponseList(games) ? games : []));

  } catch (e) {
    Flash.error({ msg: "Fetching history failed", identifier: "history" });
    store.dispatch(setLoading(false));
  }

  store.dispatch(setLoading(false));
}
