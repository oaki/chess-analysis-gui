import * as React from "react";
import {connect, Provider} from "react-redux";
import {Route, Router, Switch} from "react-router"
import {BrowserRouter} from "react-router-dom"
import {MenuWithRouter} from "../components/Menu";
import {setError, setLoading} from "../actions";
import {store} from "../store";
import config from "../config";
import {Header} from "../components/Header";
import {HistoryList, setHistoryGameList} from "../components/historyList/historyList";

export class HistoryPage extends React.PureComponent<any, undefined> {

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Header title="History"/>

                        <div className="row bg-mine-shaft1">
                            <div className="col-md-12">
                                <HistoryList list={[]} history={this.props.history}/>
                            </div>
                        </div>

                    </div>

                    <MenuWithRouter showMainMenu={true}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        store.dispatch(loadHistoryGames());
    }
}


export function loadHistoryGames() {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const token = getState()["user"]["token"];
        dispatch(setLoading(true));

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
            dispatch(setHistoryGameList(games));
            // dispatch(checkWorkers(workerList));

        } catch (e) {
            dispatch(setError("opening book failed"));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

