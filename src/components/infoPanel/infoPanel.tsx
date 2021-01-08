import React, { memo } from "react";
import { connect } from "react-redux";
import { Info, MenuBook, Psychology } from "@emotion-icons/material";
import store from "../../store";
import { PanelTabType, setPanelTab } from "./infoPanelReducers";
import { IEvaluation, LINE_MAP } from "../../interfaces";
import { getNodes, getScore, getTime } from "../evaluation/evaluation";
import { IOnMove } from "../../actions";
import styled from "@emotion/styled";

const classNames = require("classnames");

const InfoPanel = memo((props: InfoPanelProps) => {
  return (
    <div className={"d-f"}>
      <>
        {renderButton(PanelTabType.INFO_TAB, Info, props.panelTab)}
        {renderButton(PanelTabType.EVALUATION_TAB, Psychology, props.panelTab)}
        {renderButton(PanelTabType.BOOK_TAB, MenuBook, props.panelTab)}
      </>

      {renderScore(props)}
    </div>
  );
});

function handleButton(event: any) {
  const tabId = event.currentTarget.dataset.tab;
  store.dispatch(setPanelTab(tabId));
}

function renderButton(id: string, IconComponent: typeof Info, panelTab: string) {
  const classname = classNames("btn btn-panel", {
    is_active: panelTab === id
  });
  return (
    <button onClick={handleButton} data-tab={id} className={classname}>
      <IconComponent color={"white"} height={16} width={16} />
    </button>
  );
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
  );

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

export const SmartInfoPanel = connect((state: any) => ({
  fen: state.fen,
  evaluation: state.evaluation,
  onMove: state.onMove,
  isFlip: state.isFlip,
  isOnline: state.isOnline,
  panelTab: state.panelTab,
  settings: state.settings
}))(InfoPanel);