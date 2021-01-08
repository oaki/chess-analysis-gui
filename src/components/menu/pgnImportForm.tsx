import React, { FC, memo, useState } from "react";
import { openPgnDialog } from "./menuReducers";
import store from "../../store";
import { ApiManagerService } from "../../services/apiManager";
import { SessionManagerService } from "../../services/sessionManager";
import { setEvaluation, setPosition } from "../../actions";
import { batchActions } from "redux-batched-actions";
import { lastMoveId, setHistory } from "../history/historyReducers";
import { setSyzygyEvaluation } from "../syzygyExplorer/syzygyExplorerReducers";
import { loadOpeningPosition, setOpeningPosition } from "../openingExplorer/openingExplorerReducers";
import { SmallLoading } from "../Loading";
import { emitPosition } from "../../services/sockets/actions";
import { loadGamesFromDatabase } from "../gamesDatabaseExplorer/gamesDatabaseReducers";
import { FIRST_ID } from "../moveTree/tree";
import { FIRST_POSITION } from "../../contants";
import styled from "@emotion/styled";

const PgnImportForm: FC<PgnImportFormProps> = memo(({}) => {

  const [state, setState] = useState({
    value: "", isLoading: false, errorMsg: ""
  });

  const handleCloseModal = function() {
    store.dispatch(openPgnDialog(false));
  };

  const handleSubmit = async function(event) {
    const pgn = state.value;
    event.preventDefault();

    setState((prevState) => ({ ...prevState, isLoading: true, errorMsg: "" }));

    try {
      const token = SessionManagerService.getToken();
      if (!token) {
        setState((prevState) => ({ ...prevState, isLoading: false, errorMsg: "Import failed. Token is not valid." }));
        return;
      }

      const result: any = await ApiManagerService.importGameFromPgn(pgn, token);

      setState((prevState) => ({ ...prevState, isLoading: false }));

      store.dispatch(openPgnDialog(false));

      const moves = JSON.parse(result.moves);
      store.dispatch(batchActions([
        setHistory(moves),
        lastMoveId(FIRST_ID),
        setPosition(FIRST_POSITION),
        setOpeningPosition([]),
        setEvaluation([]),
        setSyzygyEvaluation(null)
      ]));

      store.dispatch(emitPosition(FIRST_POSITION, "", null));
      store.dispatch(loadOpeningPosition(FIRST_POSITION));
      store.dispatch(loadGamesFromDatabase(FIRST_POSITION));

    } catch (e) {
      console.log(e);
      const errorMsg = "Import PGN failed.";
      setState((prevState) => ({ ...prevState, isLoading: false, errorMsg }));
    }
  };
  return (
    <div>
      <div className="modal-header">
        <h5 className="modal-title">Import PGN <small>(paste from clipboard)</small></h5>
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
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
                        <textarea
                          onChange={(e) => {
                            const value = e.target.value;
                            setState((prevState) => ({ ...prevState, value, errorMsg: "" }));
                          }}
                          className="pgn-textarea"
                          placeholder="e.g. 1. e4 e5 2. Nf3..."
                        />
          {state.errorMsg && <StyledErrorMsg>{state.errorMsg}</StyledErrorMsg>}
        </div>
        <div className="modal-footer">
          <SmallLoading isLoading={state.isLoading} />
          <button type="submit" className="btn btn-primary">Import</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModal}
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
});

const StyledErrorMsg = styled.div`
  font-size: 1.2rem;
  color: red;
`;

export type PgnImportFormProps = {}

export default PgnImportForm;