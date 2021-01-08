import React, { FC, memo, useState } from "react";
import { useStockFishWorker } from "./useStockFish";
import { shallowEqual, useSelector } from "react-redux";
import { IState } from "../../interfaces";
import { treeService } from "../moveTree/tree";
import { Eval } from "./evaluation";
import styled from "@emotion/styled";
import { Settings } from "@emotion-icons/material";
import {
  StyledBtn,
  StyledBtnText,
  StyledFormWrapper,
  StyledInput,
  StyledLabel,
  StyledPairsWrapper
} from "components/ui/formComponents";


type ControllerProps = {}
type EngineState = {
  delay: number;
  multiPv: number;
}
export const SmartStockFish = memo((props: ControllerProps) => {
  const [state, setState] = useState({
    doEvaluation: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [engineState, setEngineState] = useState<EngineState>({
    delay: 15, // ten second
    multiPv: 2
  });

  const { lastFen, lastMoveId } = useSelector((state: IState) => ({
    lastFen: state.fen,
    lastMoveId: state.lastMoveId
  }), shallowEqual);

  const onSubmit = (newEngineState: EngineState) => {
    console.log("onSubmit-> newEngineState", newEngineState);
    setEngineState(newEngineState);
  };
  return (
    <div>
      <StyledButtonToggle isActive={state.doEvaluation} onClick={
        () => {
          setState({
              doEvaluation: !state.doEvaluation
            }
          );
        }
      }>
        Stockfish on phone
      </StyledButtonToggle>
      <StyledButtonSettings onClick={() => {
        setIsModalOpen(!isModalOpen);
      }}>
        <Settings width={18} />
      </StyledButtonSettings>

      {isModalOpen && (
        <StockFishModal
          engineState={engineState}
          onSubmit={onSubmit}
          handleCloseModal={() => {
            setIsModalOpen(!isModalOpen);
          }} />)}

      {state.doEvaluation && <OfflineStockFishEvaluation
        lastMoveId={lastMoveId}
        lastFen={lastFen}
        delay={engineState.delay}
        multiPv={engineState.multiPv}
      />}
    </div>
  );
});


type StockFishModalProps = {
  handleCloseModal: any;
  engineState: EngineState;
  onSubmit: (engineState: EngineState) => void;
}

const StockFishModal: FC<StockFishModalProps> = memo(({ handleCloseModal, engineState, onSubmit }) => {
  const [state, setState] = useState<EngineState>(engineState);
  const onChange = (name) => (e) => {
    const newValue = Number(e.target.value);
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
  };

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "#3c3c3cb5" }} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Stockfish on phone - Settings</h5>
            <button
              onClick={handleCloseModal}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={(event) => {
              event.preventDefault();
              onSubmit(state);
              handleCloseModal();
            }}>
              <StyledFormWrapper>
                <StyledPairsWrapper>
                  <StyledLabel>Multi pv (number of lines)</StyledLabel>
                  <StyledInput onChange={onChange("multiPv")} type="number" value={state.multiPv} />
                </StyledPairsWrapper>
                <StyledPairsWrapper>
                  <StyledLabel>Delay</StyledLabel>
                  <StyledInput onChange={onChange("delay")} type="number" value={state.delay} />
                </StyledPairsWrapper>

                <StyledBtn type={"submit"}>
                  <StyledBtnText>Change</StyledBtnText>
                </StyledBtn>

              </StyledFormWrapper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
type StyledButtonToggleProps = { isActive: boolean }
const StyledButtonToggle = styled.button<StyledButtonToggleProps>`
  padding: 0.6rem 0 0.6rem;

  ${(props: StyledButtonToggleProps) => props.isActive ? "color: white;" : "color: #666;"}
  &:focus {
    outline: 0 none;
  }
`;
const StyledButtonSettings = styled.button`
  padding: 0.6rem;
  color: #666;
`;

type OfflineStockFishEvaluationProps = {
  lastMoveId: number;
  lastFen: string;
  multiPv: number;
  delay: number;
}
const OfflineStockFishEvaluation = memo((props: OfflineStockFishEvaluationProps) => {
  const movesLine = treeService.getMoveLine(props.lastMoveId);
  const [worker, evaluations] = useStockFishWorker(props.lastFen, movesLine, props.delay, props.multiPv);
  console.log({ worker, evaluations });

  return (
    <div>
      {evaluations && <Eval
        evaluations={evaluations}
        fen={props.lastFen}
        name={"Local"}
      />}
    </div>
  );
});