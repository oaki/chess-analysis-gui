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


export class ChessboardPage extends React.Component<any, any> {

    render() {

        return (
            <BootstrapData>
                <div className="container">

                    <SmartError/>

                    <div className="row">
                        <div className="col-md-7">
                            <SmartAwesomeChessboard key="1"/>
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



