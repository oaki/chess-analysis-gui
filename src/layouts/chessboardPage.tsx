import React, {memo} from "react";
import {SmartPanel} from "../components/Panel";
import {MenuWithRouter} from "../components/menu/menu";
import {SmartInfoPanel} from "../components/infoPanel/infoPanel";
import {SmartAwesomeChessboard} from "../components/chessboard/chessboardController";
import styled from "@emotion/styled";
import {useRefCallback} from "components/hooks/useRefCallback";
import useResizeObserver from "use-resize-observer";
import {useScreenOrientation} from "hooks/useScreenOrientation";


const Column = styled.div`
    flex: 50%;
`;

export const ChessboardPage = memo(() => {
    const [wrapperEl, setWrapperRef] = useRefCallback<HTMLDivElement>();
    const [infoWrapperEl, setInfoWrapperRef] = useRefCallback<HTMLDivElement>();
    const orientation = useScreenOrientation();
    console.log("orientation", orientation);
    const isLandscape = window.innerWidth > window.innerHeight;

    const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>();
    console.log("window.innerHeight", window.innerHeight);
    console.log({width, height});

    if (orientation === "landscape") {
        return (
            <div
                ref={setWrapperRef}
                className={"d-f"}
            >
                <Column>
                    <SmartAwesomeChessboard/>
                </Column>

                <Column>
                    <SmartInfoPanel/>
                    <SmartPanel/>

                    <MenuWithRouter
                        showMainMenu={true}
                        showFlip={true}
                        showUndo={true}
                        showRedo={true}
                        showAutoplay={true}
                    />
                </Column>
            </div>
        );
    }
    return (
        <StyledWrapper
            ref={setWrapperRef}
            chessboardHeight={isLandscape ? window.innerHeight : window.innerWidth}
            appHeight={window.innerHeight}
        >
            <SmartAwesomeChessboard/>
            <SmartInfoPanel/>

            <div ref={ref} style={{overflow: "hidden"}}>
                <div style={{height}}>
                    <SmartPanel/>
                </div>
            </div>

            <MenuWithRouter
                showMainMenu={true}
                showFlip={true}
                showUndo={true}
                showRedo={true}
                showAutoplay={true}
            />
        </StyledWrapper>

    );
});

export default ChessboardPage;

const StyledWrapper = styled.div`
    height: ${(props: StyledWrapperProps) => (`${props.appHeight}px`)};
    display: grid;
    grid-template-rows: ${(props: StyledWrapperProps) => (`${props.chessboardHeight}px`)} 23px auto 30px;
`;

type StyledWrapperProps = {
    appHeight: number;
    chessboardHeight: number;
}


