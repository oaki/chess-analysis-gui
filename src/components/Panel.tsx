import React, { FC, memo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { SmartOpeningExplorer } from "./openingExplorer/openingExplorer";
import { SmartEvaluation } from "./evaluation/evaluation";
import { SyzygyExplorerSmart } from "./syzygyExplorer/syzygyExplorer";
import { SmartGamesDatabaseExplorer } from "./gamesDatabaseExplorer/gamesDatabaseExplorer";
import { History } from "./history/history";
import { PanelTabType } from "./infoPanel/infoPanelReducers";
import { SmartStockFish } from "./evaluation/offlineStockfishEvaluation";
import styled from "@emotion/styled";
import { IState } from "interfaces";

interface IEvaluation {
  score: string;
  pv: string;
  mate: string;
  nodes: string;
}


type PanelProps = {}
const Panel: FC<PanelProps> = memo(() => {
  const panelTab = useSelector((state: IState) => {
    return state.panelTab;
  }, shallowEqual);

  return (
    <React.Fragment>

      {panelTab === PanelTabType.INFO_TAB && <History />}
      {panelTab === PanelTabType.EVALUATION_TAB && (
        <div>
          <SmartStockFish />
          <SmartEvaluation name={"Cloud"} />
        </div>
      )}
      {panelTab === PanelTabType.BOOK_TAB && (
        <Wrapper>
          <div className="section">
            <SmartOpeningExplorer />
            <SmartGamesDatabaseExplorer />
            <SyzygyExplorerSmart />
          </div>
        </Wrapper>
      )}


      {/*<div className="app__status">*/}
      {/*    <div className="app__pgn">{state.pgn}</div>*/}
      {/*    <div className="app__fen">{state.fen}</div>*/}
      {/*    <div className="app__opening">{props.status}</div>*/}
      {/*</div>*/}


    </React.Fragment>
  );
});
const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  .section {
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    /* for Firefox */
    min-height: 0;
  }

  .scrollable-content {
    background: white;
    flex-grow: 1;

    overflow: auto;

    /* for Firefox */
    min-height: 0;
  }

`;

export const SmartPanel = Panel;
