import * as React from "react";
import {openPgnDialog} from "./menuReducers";
import store from "../../store";
import {ApiManagerService} from "../../services/apiManager";
import {SessionManagerService} from "../../services/sessionManager";
import {setEvaluation, setPosition} from "../../actions";
import {batchActions} from "redux-batched-actions";
import {lastMoveId, setHistory} from "../history/historyReducers";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import {loadOpeningPosition, setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {SmallLoading} from "../Loading";
import {emitPosition} from "../../services/sockets/actions";
import {loadGamesFromDatabase} from "../gamesDatabaseExplorer/gamesDatabaseReducers";
import {FIRST_POSITION} from "../chessboard/chessboardController";

export default class PgnImportForm extends React.PureComponent<any, any> {

    constructor(props) {
        super(props);
        this.state = {value: "", isLoading: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {

        const pgn = this.state.value;
        event.preventDefault();

        this.setState({isLoading: true});
        try {
            ApiManagerService.importGameFromPgn(pgn, SessionManagerService.getToken()).then((res: any) => {

                this.setState({isLoading: false});

                store.dispatch(openPgnDialog(false));

                const moves = JSON.parse(res.moves);
                store.dispatch(batchActions([
                    setHistory(moves),
                    lastMoveId(null),
                    setPosition(FIRST_POSITION),
                    setOpeningPosition([]),
                    setEvaluation([]),
                    setSyzygyEvaluation(null),
                ]));

                store.dispatch(emitPosition(FIRST_POSITION, "", null));
                store.dispatch(loadOpeningPosition(FIRST_POSITION));
                store.dispatch(loadGamesFromDatabase(FIRST_POSITION));
            });
        } catch (e) {
            console.log(e);

            this.setState({isLoading: false});
        }
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
                        <SmallLoading isLoading={this.state.isLoading}/>
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