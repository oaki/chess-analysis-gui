import React, {FC, memo, useEffect} from "react";
import {MenuWithRouter} from "../components/menu/menu";
import {setLoading} from "../actions";
import store from "../store";
import config from "../config";
import {Header} from "../components/Header";
import {SmartHistoryList} from "../components/historyList/smartHistoryList";
import {setHistoryGameList} from "../components/historyList/historyListReducers";
import {Flash} from "../services/errorManager";
import {SessionManagerService} from "../services/sessionManager";

export default HistoryPage;
export const HistoryPage: FC<HistoryPageProps> = memo(({history}) => {

    useEffect(() => {
        loadHistoryGames();
    }, [])
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <Header title="History"/>

                    <div className="row bg-mine-shaft1">
                        <div className="col-md-12">
                            <SmartHistoryList history={history}/>
                        </div>
                    </div>

                </div>

                <MenuWithRouter showMainMenu={true}/>
            </div>
        </div>
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
        }),
    };

    try {
        const response = await fetch(url, headers);
        if (!response.ok) {
            throw new Error("Loading failed");
        }

        const games: any = await response.json();
        console.log(games);
        store.dispatch(setHistoryGameList(games));

    } catch (e) {
        Flash.error({msg: "Fetching history failed", identifier: "history"});
        store.dispatch(setLoading(false));
    }

    store.dispatch(setLoading(false));
}
export type HistoryPageProps = {
    history: any;
}
