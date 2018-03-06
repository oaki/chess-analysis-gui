import * as React from 'react';
import {Provider} from 'react-redux';
import {Pannel} from "./Pannel";
import {store} from "./store";
import {SmartChessboard} from './Chessboard';
import * as $ from 'jquery';
import {connect} from 'react-redux';

const win: any = window;
win.$ = $;


import {SocketIoProvider} from "./SocketIoProvider";


class App extends React.Component<any, any> {

    render() {

        return (
            <Provider store={store}>

                <div className="app container">

                    <SmartError/>



                    <div className="row">
                        <div className="col-md-7">
                            <SmartChessboard/>
                        </div>
                        <div className="col-md-5">
                            <SocketIoProvider>
                                <Pannel />
                            </SocketIoProvider>
                        </div>

                    </div>
                </div>
            </Provider>
        );
    }
}


class Error extends React.PureComponent<any, any> {
    render() {
        if (this.props.msg === '') {
            return null;
        }
        return (
            <div className="alert alert-danger">
                {this.props.msg}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        msg: state.error
    }
}

export const SmartError = connect(mapStateToProps)(Error);
export default App;
