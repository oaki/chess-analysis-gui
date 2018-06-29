import * as React from 'react';
import {Provider} from 'react-redux';
import {Pannel} from "../components/Pannel";
import {Router, Route, Switch} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {Menu} from "../components/Menu";
import {History} from "../components/History";
import {SmartAwesomeChessboard} from "../components/AwesomeChessboard";
import BootstrapData from "../components/BootstrapData";
import {SmartError} from "../components/error";
import {checkWorkers, loadEngines, setError, setLoading, setUser, setWorkerList} from "../actions";
import {store} from "../store";
import config from "../config";
import {Header} from "../components/Header";


export class HistoryPage extends React.Component<any, any> {

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Header title="History"/>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>page</th>
                            </tr>

                            </thead>
                            <tbody>
                            <tr>
                                <td>sss</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <Menu showMainMenu={true}/>
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

        const token = getState()['user']['token'];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/history?offset=${Number(0)}&limit=${Number(10)}&order=DESC`;
        const headers: RequestInit = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }),
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const games: any = await response.json();
            console.log(games);
            // dispatch(setWorkerList(workerList));
            // dispatch(checkWorkers(workerList));

        } catch (e) {
            dispatch(setError('opening book failed'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

