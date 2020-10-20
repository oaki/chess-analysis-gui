import React from "react";
import * as ReactDOM from "react-dom";
import {connect} from "react-redux";
import store from "../../store";
import {Link, withRouter} from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import * as faBars from "@fortawesome/fontawesome-free-solid/faBars";
import * as faPlay from "@fortawesome/fontawesome-free-solid/faPlay";

import {addNewGame, IOnMove, setEvaluation, setPosition, setStatus, setWhoIsOnMove} from "../../actions";
import {SessionManagerService} from "../../services/sessionManager";
import {batchActions} from "redux-batched-actions";
import {FIRST_ID, firstNode, Node, NODE_MAP, treeService} from "../moveTree/tree";
import {lastMoveId, setHistory} from "../history/historyReducers";
import {faPause} from "@fortawesome/fontawesome-free-solid";
import {loadOpeningPosition, setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {flipBoard, openPgnDialog, toggleAutoplay, toogleOpenMenu} from "./menuReducers";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import PgnImportForm from "./pgnImportForm";
import {emitPosition} from "../../services/sockets/actions";
import {loadGamesFromDatabase} from "../gamesDatabaseExplorer/gamesDatabaseReducers";
import {VERSION} from "../../libs/version";
import {IEvaluation, Nullable, Undef} from "../../interfaces";
import {FIRST_POSITION} from "../../contants";

const mapStateToProps = (state) => ({
    isOpen: state.menu.isOpen,
    autoplay: state.autoplay,
    pgnDialog: state.pgnDialog,
});

export class M extends React.PureComponent<any, any> {

    handleFlipBoard() {
        store.dispatch(flipBoard());
    }

    toggleAutoplay() {
        store.dispatch(toggleAutoplay());
    }

    handleUndo() {
        const lastMove = store.getState()["lastMoveId"];
        const previousMove: Undef<Node> = treeService.getPrevMove(lastMove);

        if (!previousMove) {
            return;
        }
        let id: number = FIRST_ID;
        if (previousMove && previousMove[NODE_MAP.id]) {
            id = (previousMove[NODE_MAP.id]);
        }

        const fen: string = previousMove ? previousMove[NODE_MAP.fen] : FIRST_POSITION;
        store.dispatch(batchActions([
            toggleAutoplay(false),
            lastMoveId(id),
            setPosition(fen),
            setOpeningPosition([]),
            setEvaluation([]),
        ]));

        let previousEvaluation: Nullable<IEvaluation> = null;
        if (previousMove) {
            const evaluations = previousMove[NODE_MAP.evaluation];
            if (evaluations && evaluations[0]) {
                previousEvaluation = evaluations[0];
            }
        }

        store.dispatch(emitPosition(fen, previousMove[NODE_MAP.move], previousEvaluation));
        store.dispatch(loadOpeningPosition(fen));
        store.dispatch(loadGamesFromDatabase(fen));
    }

    handleRedo() {

        const lastId: number = store.getState()["lastMoveId"];
        const nextMove: Node | undefined = treeService.getNextMove(lastId);

        if (nextMove && nextMove[NODE_MAP.id]) {
            const fen: string = nextMove[NODE_MAP.fen];
            store.dispatch(batchActions([
                toggleAutoplay(false),
                lastMoveId((nextMove[NODE_MAP.id] as number)),
                setPosition(nextMove[NODE_MAP.fen]),
                setOpeningPosition([]),
                setEvaluation([]),
            ]));

            //todo send previous evaluation
            let previousEvaluation: IEvaluation | null = null;
            const evaluations = nextMove[NODE_MAP.evaluation];
            if (evaluations && evaluations[0]) {
                previousEvaluation = evaluations[0];
            }

            store.dispatch(emitPosition(fen, nextMove[NODE_MAP.move], previousEvaluation));

            store.dispatch(loadOpeningPosition(fen));
            store.dispatch(loadGamesFromDatabase(fen));
        }
    }

    handleToggleSubMenu() {
        store.dispatch(toogleOpenMenu());
    }

    handleLogout = () => {
        SessionManagerService.removeToken();
        SessionManagerService.removeTemporaryToken();
        window.location.href = "/";
    }

    handleNewGame = () => {
        store.dispatch(toogleOpenMenu(false));
        store.dispatch(addNewGame((id) => {
            store.dispatch(batchActions([
                setStatus(""),
                setWhoIsOnMove(IOnMove.WHITE),
                lastMoveId(FIRST_ID),
                setPosition(FIRST_POSITION),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([]),
                setHistory([firstNode])
            ]));

            store.dispatch(emitPosition(FIRST_POSITION, "", null));
            store.dispatch(loadOpeningPosition(FIRST_POSITION));
            store.dispatch(loadGamesFromDatabase(FIRST_POSITION));
            console.log("id", id);
        }));
    };

    handleNewGameFromPgn = () => {
        store.dispatch(toogleOpenMenu(false));
        store.dispatch(addNewGame((id) => {
            store.dispatch(batchActions([
                setStatus(""),
                setWhoIsOnMove(IOnMove.WHITE),
                lastMoveId(FIRST_ID),
                setPosition(FIRST_POSITION),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([]),
                setHistory([firstNode])
            ]));

            store.dispatch(emitPosition(FIRST_POSITION, "", null));
            store.dispatch(loadOpeningPosition(FIRST_POSITION));
            store.dispatch(loadGamesFromDatabase(FIRST_POSITION));
            console.log("id", id);
        }));
    };

    handleOpenTextareaFromPgn = () => {
        store.dispatch(toogleOpenMenu(false));
        store.dispatch(openPgnDialog(true));

    };

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
    }

    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            if (store.getState()["menu"].isOpen) {
                store.dispatch(toogleOpenMenu(false));
            }
        }
    }


    renderPgnDialog() {
        return (
            <div className="modal" style={{display: "block", backgroundColor: "#3c3c3cb5"}} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <PgnImportForm/>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const btnClasses = "btn btn-link btn-block bottom-menu__font-size";

        return (
            <div className="bottom-menu">
                {this.props.pgnDialog && this.renderPgnDialog()}

                {this.renderSubmenu()}


                <ul className="main">
                    {this.props.showMainMenu &&
                    <li>
                      <button
                        className={btnClasses}
                        onClick={this.handleToggleSubMenu}
                      ><FontAwesomeIcon icon={faBars}/>
                      </button>
                    </li>}
                    {this.props.showFlip &&
                    <li>
                      <button
                        className={btnClasses}
                        onClick={this.handleFlipBoard}
                      >
                        <FontAwesomeIcon icon={faRetweet}/>
                      </button>
                    </li>}
                    {this.props.showAutoplay &&
                    <li>
                      <button
                        className={btnClasses}
                        onClick={this.toggleAutoplay}
                      >
                          {!this.props.autoplay && <FontAwesomeIcon icon={faPlay}/>}
                          {this.props.autoplay && <FontAwesomeIcon icon={faPause}/>}
                      </button>
                    </li>}
                    {this.props.showUndo &&
                    <li>
                      <button
                        className={btnClasses}
                        onClick={this.handleUndo}
                      ><FontAwesomeIcon icon={faAngleDoubleLeft}/>
                      </button>
                    </li>}
                    {this.props.showRedo &&
                    <li>
                      <button
                        className={btnClasses}
                        onClick={this.handleRedo}
                      ><FontAwesomeIcon icon={faAngleDoubleRight}/>
                      </button>
                    </li>}
                </ul>
            </div>
        )
    }

    handleBeforeGoToList = () => {
        store.dispatch(toogleOpenMenu());
    }

    renderSubmenu() {
        // store.dispatch(openPgnDialog(true));
        if (this.props.isOpen) {
            return (
                <div className="position-relative">
                    <ul className="sub-menu">
                        <li className="sub-menu__line">
                            <Link to="/" onClick={this.handleNewGame}>New game</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/" onClick={this.handleOpenTextareaFromPgn}>New game from PGN</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/user/history" onClick={this.handleBeforeGoToList}>History</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/user/engines" onClick={this.handleBeforeGoToList}>My chess engines</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/settings">Settings</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/auth/sign-in" onClick={this.handleLogout}>Logout</Link>
                        </li>

                        <li className="sub-menu__version">
                            version {VERSION}
                        </li>
                    </ul>
                </div>
            )

        }
    }
}

const Menu: any = connect<any>(mapStateToProps)(M);
export const MenuWithRouter: any = withRouter(Menu);

