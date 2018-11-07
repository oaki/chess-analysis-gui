import * as React from "react";
import {openPgnDialog} from "./menuReducers";
import store from "../../store";
import {ApiManagerService} from "../../services/apiManager";
import {SessionManagerService} from "../../services/sessionManager";
import {setEvaluation, setPosition} from "../../actions";
import {batchActions} from "redux-batched-actions";
import {lastMoveId, setHistory} from "../history/historyReducers";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {SmartAwesomeChessboard} from "../chessboard/chessboard";

export default class PgnImportForm extends React.PureComponent<any, any> {

    constructor(props) {
        super(props);
        this.state = {value: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {

        const pgn = this.state.value;
        event.preventDefault();

        ApiManagerService.importGameFromPgn(pgn, SessionManagerService.getToken()).then((res: any) => {
            console.log(res);
            store.dispatch(openPgnDialog(false));

            const moves = JSON.parse(res.moves);
            store.dispatch(batchActions([
                setHistory(moves),
                lastMoveId(null),
                setPosition(SmartAwesomeChessboard.FIRST_POSITION),
                setOpeningPosition([]),
                setEvaluation([]),
                setSyzygyEvaluation(null),
            ]));
        });
    }

    handleCloseModal() {
        store.dispatch(openPgnDialog(false));
    }


    render() {
        return (
            <div>
                <div className="modal-header">
                    <h5 className="modal-title">Import PGN <small>(paste from clipboard)</small></h5>
                    <button
                        onClick={this.handleCloseModal}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="modal-body">
                        <textarea
                            onChange={this.handleChange}
                            className="pgn-textarea"
                            placeholder="e.g. 1. e4 e5 2. Nf3..."
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">Import</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.handleCloseModal}
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}