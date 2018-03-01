import * as React from 'react';
import {Provider} from 'react-redux';
import {Pannel} from "./Pannel";
import {store} from "./store";
import {SmartChessboard} from './Chessboard';
import * as $ from 'jquery';

const win: any = window;
win.$ = $;

import './assets/css/app.css';
import {SocketIoProvider} from "./SocketIoProvider";


class App extends React.Component<any, any> {

    render() {

        return (
            <Provider store={store}>
                <div className="app container">

                    <div className="row">
                        <div className="col-md-7">
                            <SmartChessboard/>
                        </div>
                        <div className="col-md-5">
                            <SocketIoProvider>
                                <Pannel/>
                            </SocketIoProvider>
                        </div>

                    </div>
                </div>
            </Provider>
        );
    }
}

export default App;
