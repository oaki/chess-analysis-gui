import * as React from "react";
import {connect, Provider} from "react-redux";
import {Pannel} from "../components/Pannel";
import {Route, Router, Switch} from "react-router"
import {BrowserRouter} from "react-router-dom"
import {MenuWithRouter} from "../components/menu/menu";
import {History} from "../components/history/history";
import {SmartAwesomeChessboard} from "../components/chessboard/chessboard";
import BootstrapData from "../components/bootstrapData";


export class ChessboardPage extends React.Component<any, any> {

    render() {

        // calculate height for
        const availHeight = window.innerHeight;
        const availWidth = window.innerWidth;
        const chessboarcWidth = availWidth - 30/* padding:15*/;
        const chessboarcHeight = chessboarcWidth;
        const height = availHeight - 40 /* bottom menu height */ - chessboarcHeight;

        console.log({
            availHeight, availWidth, chessboarcWidth, chessboarcHeight, height
        });
        return (
            <BootstrapData>
                <div className="container">

                    <div className="row">
                        <div className="col-md-7">
                            <SmartAwesomeChessboard key="1"/>
                        </div>
                        <div className="col-md-5">
                            <div className="ox-a" style={{height}}>
                                <Pannel/>
                                <History/>
                            </div>
                        </div>
                    </div>


                    <MenuWithRouter
                        showMainMenu={true}
                        showFlip={true}
                        showUndo={true}
                        showRedo={true}
                        showAutoplay={true}
                    />
                </div>
            </BootstrapData>
        );
    }
}



