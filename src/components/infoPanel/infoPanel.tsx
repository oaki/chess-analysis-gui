import * as React from "react";
import {memo} from "react";
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
import {IOnMove} from "../../actions";

const classNames = require("classnames");

const InfoPanel = memo((props: InfoPanelProps) => {
    return (
        <>
            <>
                {renderButton(PanelTabType.INFO_TAB, faInfoCircle, props.panelTab)}
                {renderButton(PanelTabType.EVALUATION_TAB, faCogs, props.panelTab)}
                {renderButton(PanelTabType.BOOK_TAB, faBook, props.panelTab)}
            </>

            {renderScore(props)}
        </>
    )
});

function handleButton(event: any) {
    const tabId = event.currentTarget.dataset.tab;
    store.dispatch(setPanelTab(tabId));
}

function renderButton(id: string, icon: IconDefinition, panelTab: string) {
    const classname = classNames({
        is_active: panelTab === id,
        btn: true,
        "btn-panel": true
    });
    return (
        <button onClick={handleButton} data-tab={id} className={classname}>
            <FontAwesomeIcon className="c-white" icon={icon}/>
        </button>
    )
}

function renderScore(props: InfoPanelProps) {
    if (props.evaluation.length === 0) {
        return null;
    }
    const evaluation: IEvaluation = props.evaluation[0];

    return (
        <div className="info-panel__score-container">
                <span className="info-panel__score">
                    {Evaluation.getScore(evaluation, props.onMove, props.isFlip)}
                    {!evaluation[LINE_MAP.mate] &&
                    <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
                </span>
            <span className="info-panel__nodes">n: {Evaluation.getNodes(evaluation)}</span>
            <span className="info-panel__time">t: {Evaluation.getTime(evaluation)}</span>

        </div>
    )

}

interface InfoPanelProps {
    fen: string;
    evaluation: IEvaluation[];
    isFlip: boolean;
    onMove: IOnMove;
    isOnline: boolean;
    panelTab: string;
    settings: string;
}

export const SmartInfoPanel = connect((state:any) => ({
    fen: state.fen,
    evaluation: state.evaluation,
    onMove: state.onMove,
    isFlip: state.isFlip,
    isOnline: state.isOnline,
    panelTab: state.panelTab,
    settings: state.settings
}))(InfoPanel);