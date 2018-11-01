import * as React from "react";
import {connect, Provider} from "react-redux";
import {Pannel} from "../components/Pannel";
import {Route, Router, Switch} from "react-router"
import {BrowserRouter} from "react-router-dom"
import {MenuWithRouter} from "../components/menu/menu";
import {History} from "../components/history/history";
import {SmartAwesomeChessboard} from "../components/chessboard/chessboard";


export class ChessboardPage extends React.Component<any, any> {

    render() {

        // calculate height for
        const availHeight = window.innerHeight;
        const availWidth = window.innerWidth;
        const chessboarcWidth = availWidth - 30/* padding:15*/;
        const chessboarcHeight = chessboarcWidth;
        const evaluationHeight = 34;
        const height = availHeight - 40 /* bottom menu height */ - chessboarcHeight - evaluationHeight;
        console.log({
            availHeight, availWidth, chessboarcWidth, chessboarcHeight, height
        });
        return (

            <div className="container container-fullscreen">

                <div className="row">
                    <div className="col-sm-7">
                        <SmartAwesomeChessboard key="1"/>
                    </div>
                    <div className="col-sm-5">
                        <Pannel/>

                        <div className="ox-a" style={{marginLeft: "-15px", marginRight: "-15px", height}}>
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

        );
    }
}



