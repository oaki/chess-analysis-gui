import React, { memo } from "react";
import type { MouseEvent } from "react";
import { connect } from "../../libs/stateCompat";
import { Info, MenuBook, Psychology } from "@emotion-icons/material";
import { store } from "../../store";
import { PanelTabType, setPanelTab } from "./infoPanelReducers";
import { IEvaluation, LINE_MAP } from "../../interfaces";
import { getNodes, getScore, getTime } from "../evaluation/evaluation";
import { IOnMove } from "../../actions";
import { ReduxStateShape } from "../../reducers";
import styled from "@emotion/styled";

import classNames from "classnames";

type InfoPanelProps = {
  fen: string;
  evaluation: IEvaluation[];
  isFlip: boolean;
  onMove: IOnMove;
  isOnline: boolean;
  panelTab: string;
  settings: unknown;
}

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

function handleButton(event: MouseEvent<HTMLButtonElement>) {
  const tabId = event.currentTarget.dataset.tab;
  if (!tabId) {
    return;
  }
  if (tabId === PanelTabType.INFO_TAB || tabId === PanelTabType.EVALUATION_TAB || tabId === PanelTabType.BOOK_TAB) {
    store.dispatch(setPanelTab(tabId));
  }
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

const StyledScoreLayout = styled.div`
  padding: .2rem .4rem;
`;

const StyledScoreCol = styled.span`
  display: inline-block;
  padding: 0 .5rem;
`;

function renderScore(props: InfoPanelProps) {
  if (props.evaluation.length === 0) {
    return null;
  }
  const evaluation: IEvaluation = props.evaluation[0];

  return (
    <StyledScoreLayout>
      <StyledScoreCol>
        {getScore(evaluation)}
        {!evaluation[LINE_MAP.mate] &&
        <span className="fs-xs fw-r">/{evaluation[LINE_MAP.depth]}</span>}
      </StyledScoreCol>
      <StyledScoreCol>n: {getNodes(evaluation)}</StyledScoreCol>
      <StyledScoreCol>t: {getTime(evaluation)}</StyledScoreCol>

    </StyledScoreLayout>
  );

}

export const SmartInfoPanel = connect((state: ReduxStateShape) => ({
  fen: state.fen,
  evaluation: state.evaluation,
  onMove: state.onMove,
  isFlip: state.isFlip,
  isOnline: state.isOnline,
  panelTab: state.panelTab,
  settings: state.settings
}))(InfoPanel) as unknown as React.ComponentType<Record<string, never>>;