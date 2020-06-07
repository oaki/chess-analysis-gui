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
import {Evaluation, getNodes, getScore, getTime} from "../evaluation/evaluation";
import {IOnMove} from "../../actions";
import styled from "@emotion/styled";

const classNames = require("classnames");

const InfoPanel = memo((props: InfoPanelProps) => {
    return (
        <div className={'d-f'}>
            <>
                {renderButton(PanelTabType.INFO_TAB, faInfoCircle, props.panelTab)}
                {renderButton(PanelTabType.EVALUATION_TAB, faCogs, props.panelTab)}
                {renderButton(PanelTabType.BOOK_TAB, faBook, props.panelTab)}
            </>

            {renderScore(props)}
        </div>
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

const Container = styled.div`
    padding: .2rem .4rem;
`;

const Column = styled.span`
    display: inline-block;
    padding: 0 .5rem;
`;

function renderScore(props: InfoPanelProps) {
    if (props.evaluation.length === 0) {
        return null;
    }
    const evaluation: IEvaluation = props.evaluation[0];

    return (
        <Container>
                <Column>
                    {getScore(evaluation)}
                    {!evaluation[LINE_MAP.mate] &&
                    <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
                </Column>
            <Column>n: {getNodes(evaluation)}</Column>
            <Column>t: {getTime(evaluation)}</Column>

        </Container>
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