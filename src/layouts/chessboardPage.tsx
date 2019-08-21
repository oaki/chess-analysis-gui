import * as React from "react";
import {Pannel} from "../components/Pannel";
import {MenuWithRouter} from "../components/menu/menu";
import {SmartAwesomeChessboard} from "../components/chessboard/chessboard";
import {InfoPanel} from "../components/infoPanel/infoPanel";


export class ChessboardPage extends React.Component<any, any> {

    render() {

        // calculate height for
        const availWidth = window.innerWidth;
        const availHeight = window.innerHeight;

        const chessboarcWidth = availWidth - 30/* padding:15*/;
        const chessboarcHeight = chessboarcWidth;
        const infoPanelHeight = 20;
        const height = availHeight - 40 /* bottom menu height */ - chessboarcHeight - infoPanelHeight;
        console.log({
            availHeight, availWidth, chessboarcWidth, chessboarcHeight, height
        });
        return (

            <div className="container container-fullscreen">

                <div className="row">
                    <div className="col-sm-7">
                        <SmartAwesomeChessboard key="1"/>
                    </div>
                    <div className="col-sm-5 ">
                        <InfoPanel/>

                        <div className="ox-a" style={{height}}>
                            <Pannel/>
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



