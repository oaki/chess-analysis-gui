import * as React from "react";
import {connect} from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faBook from "@fortawesome/fontawesome-free-solid/faBook";
import * as faCogs from "@fortawesome/fontawesome-free-solid/faCogs";
import * as faInfoCircle from "@fortawesome/fontawesome-free-solid/faInfoCircle";
import store from "../../store";
import {PanelTabType, setPanelTab} from "./infoPanelReducers";
import {IconDefinition} from "../../../node_modules/@fortawesome/fontawesome";
import {IEvaluation, LINE_MAP} from "../../interfaces";
import {Evaluation} from "../evaluation";

const classNames = require("classnames");


@connect((state) => ({
    fen: state.fen,
    evaluation: state.evaluation,
    onMove: state.onMove,
    isFlip: state.isFlip,
    isOnline: state.isOnline,
    panelTab: state.panelTab,
    settings: state.settings
}))
export class InfoPanel extends React.Component<any, any> {

    handleButton(event: any) {
        console.log(event.currentTarget.dataset.tab);
        const tabId = event.currentTarget.dataset.tab;
        store.dispatch(setPanelTab(tabId));
    }

    renderButton(id: string, icon: IconDefinition) {
        const classname = classNames({
            is_active: this.props.panelTab === id,
            btn: true,
            "btn-panel": true
        });
        return (
            <button onClick={this.handleButton} data-tab={id} className={classname}>
                <FontAwesomeIcon className="c-white" icon={icon}/>
            </button>
        )
    }

    renderScore() {
        if (this.props.evaluation.length === 0) {
            return null;
        }
        const evaluation: IEvaluation = this.props.evaluation[0];

        return (
            <div className="info-panel__score-container">
                <span className="info-panel__score">
                    {Evaluation.getScore(evaluation, this.props.onMove, this.props.isFlip)}
                    {!evaluation[LINE_MAP.mate] &&
                    <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
                </span>
                <span className="info-panel__nodes">n: {Evaluation.getNodes(evaluation)}</span>
                <span className="info-panel__time">t: {Evaluation.getTime(evaluation)}</span>

            </div>
        )

    }

    render() {
        return (
            <div className="info-panel">

                <div className="info-panel__icons">
                    {this.renderButton(PanelTabType.INFO_TAB, faInfoCircle)}
                    {this.renderButton(PanelTabType.EVALUATION_TAB, faCogs)}
                    {this.renderButton(PanelTabType.BOOK_TAB, faBook)}
                </div>

                {this.renderScore()}
            </div>
        )
    }


}