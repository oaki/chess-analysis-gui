import * as React from "react";
import {connect} from "react-redux";
import {SmartOpeningExplorer} from "./openingExplorer/openingExplorer";
import store from "../store";
import {loadOpeningBook} from "../actions";
import {Evaluation} from "./evaluation";
import {SyzygyExplorerSmart} from "./syzygyExplorer/syzygyExplorer";
import {SmartGamesDatabaseExplorer} from "./gamesDatabaseExplorer/gamesDatabaseExplorer";
import {History} from "./history/history";
import {PanelTabType} from "./infoPanel/infoPanelReducers";

interface IPannelProps {
    status: string;
}

interface IEvaluation {
    score: string;
    pv: string;
    mate: string;
    nodes: string;

}

interface IPannelState {
    evaluation?: IEvaluation;
    loading: boolean;
    pgn?: string;
    fen?: string;
}

@connect((state) => ({
    status: state.status,
    panelTab: state.panelTab
}))
export class Pannel extends React.Component<any, IPannelState> {

    constructor(props: IPannelProps) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        console.log("onmessage LOAD AFTER componentDidMount");
        store.dispatch(loadOpeningBook());
    }


    render() {
        return (
            <React.Fragment>

                {this.props.panelTab === PanelTabType.INFO_TAB && <History/>}
                {this.props.panelTab === PanelTabType.EVALUATION_TAB && <Evaluation/>}
                {this.props.panelTab === PanelTabType.BOOK_TAB && (
                    <React.Fragment>
                        <SmartOpeningExplorer/>
                        <SmartGamesDatabaseExplorer/>
                        <SyzygyExplorerSmart/>
                    </React.Fragment>
                )}



                <div className="app__status">
                    <div className="app__pgn">{this.state.pgn}</div>
                    <div className="app__fen">{this.state.fen}</div>
                    <div className="app__opening">{this.props.status}</div>
                </div>


            </React.Fragment>
        )

    }
}
