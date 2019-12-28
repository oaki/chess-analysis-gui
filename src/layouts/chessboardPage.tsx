import * as React from "react";
import {memo} from "react";
import {SmartPanel} from "../components/Panel";
import {MenuWithRouter} from "../components/menu/menu";
import { SmartInfoPanel} from "../components/infoPanel/infoPanel";
import {SmartAwesomeChessboard} from "../components/chessboard/chessboardController";
import styled from "@emotion/styled";

const Column = styled.div`
    flex-grow: 1;
    flex-basis: 0;
`;

export const ChessboardPage = memo(() => {
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

        <div className="container-fullscreen">
            <div className={"sm-d-f"}>
                <Column className={"p-xs"}>
                    <SmartAwesomeChessboard/>
                </Column>
                <Column className={"pt-xs"}>
                    <SmartInfoPanel/>

                    <div className="ox-a" style={{height}}>
                        <SmartPanel/>
                    </div>
                </Column>
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
});



