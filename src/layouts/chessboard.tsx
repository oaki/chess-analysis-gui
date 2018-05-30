import * as React from 'react';
import {Provider} from 'react-redux';
import {Pannel} from "./../Pannel";
import {store} from "./../store";
import {SmartChessboard} from './../Chessboard';
import {GoogleLogin} from 'react-google-login';
import {Router, Route, Switch} from 'react-router'
import {BrowserRouter} from 'react-router-dom'

import * as $ from 'jquery';
import {connect} from 'react-redux';

// const win: any = window;
// win.$ = $;


import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import {Menu} from "../components/Menu";
import {History} from "../components/History";
import {AwesomeChessboard, SmartAwesomeChessboard} from "../components/AwesomeChessboard";
import BootstrapData from "../components/BootstrapData";


export class ChessboardPage extends React.Component<any, any> {

    render() {

        return (
            <BootstrapData>
                <div className="container">

                    <SmartError/>

                    <div className="row">
                        <div className="col-md-7">
                            <SmartAwesomeChessboard/>
                        </div>
                        <div className="col-md-5">
                            <Pannel/>
                        </div>
                    </div>


                    <History/>
                    <Menu/>
                </div>
            </BootstrapData>
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

