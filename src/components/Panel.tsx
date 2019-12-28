import * as React from "react";
import {memo, useEffect} from "react";
import {connect} from "react-redux";
import {SmartOpeningExplorer} from "./openingExplorer/openingExplorer";
import store from "../store";
import {loadOpeningBook} from "../actions";
import {Evaluation} from "./evaluation";
import {SyzygyExplorerSmart} from "./syzygyExplorer/syzygyExplorer";
import {SmartGamesDatabaseExplorer} from "./gamesDatabaseExplorer/gamesDatabaseExplorer";
import {History} from "./history/history";
import {PanelTabType} from "./infoPanel/infoPanelReducers";

interface IEvaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;
}

interface IPannelState {
    evaluation?: IEvaluation;
    panelTab: PanelTabType;
    pgn?: string;
    fen?: string;
}

const mapStateToProps = (state: any) => ({
    status: state.status,
    panelTab: state.panelTab
});

const Panel = memo((props: IPannelState) => {

    useEffect(() => {
        store.dispatch(loadOpeningBook());
    }, []);

    return (
        <React.Fragment>

            {props.panelTab === PanelTabType.INFO_TAB && <History/>}
            {props.panelTab === PanelTabType.EVALUATION_TAB && <Evaluation/>}
            {props.panelTab === PanelTabType.BOOK_TAB && (
                <React.Fragment>
                    <SmartOpeningExplorer/>
                    <SmartGamesDatabaseExplorer/>
                    <SyzygyExplorerSmart/>
                </React.Fragment>
            )}


            {/*<div className="app__status">*/}
            {/*    <div className="app__pgn">{state.pgn}</div>*/}
            {/*    <div className="app__fen">{state.fen}</div>*/}
            {/*    <div className="app__opening">{props.status}</div>*/}
            {/*</div>*/}


        </React.Fragment>
    )
});

export const SmartPanel = connect(mapStateToProps)(Panel);
