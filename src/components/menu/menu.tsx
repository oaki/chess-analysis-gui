import * as React from "react";
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
import {Node, NODE_MAP, treeService} from "../moveTree/tree";
import {lastMoveId, setHistory} from "../history/historyReducers";
import {SmartAwesomeChessboard} from "../chessboard/chessboard";
import {faPause} from "@fortawesome/fontawesome-free-solid";
import {setOpeningPosition} from "../openingExplorer/openingExplorerReducers";
import {flipBoard, openPgnDialog, toggleAutoplay, toogleOpenMenu} from "./menuReducers";
import {setSyzygyEvaluation} from "../syzygyExplorer/syzygyExplorerReducers";
import PgnImportForm from "./pgnImportForm";


interface IMenuProps {
    showMainMenu: boolean;
    showFlip: boolean;
    showAutoplay: boolean;
    showUndo: boolean;
    showRedo: boolean;

    history: any;
    isOpen: boolean;
}

@connect((state) => ({
    isOpen: state.menu.isOpen,
    autoplay: state.autoplay,
    pgnDialog: state.pgnDialog,
}))
export class Menu extends React.PureComponent<any, any> {

    handleFlipBoard() {
        store.dispatch(flipBoard());
    }

    toggleAutoplay() {
        store.dispatch(toggleAutoplay());
    }

    handleUndo() {

        const lastMove = store.getState()["lastMoveId"];
        const previousMove: Node | undefined = treeService.getPrevMove(lastMove);

        let id: number | null = null;
        if (previousMove && previousMove[NODE_MAP.id]) {
            id = (previousMove[NODE_MAP.id] as number);
        }
        store.dispatch(batchActions([
            toggleAutoplay(false),
            lastMoveId(id),
            setPosition(previousMove ? previousMove[NODE_MAP.fen] : SmartAwesomeChessboard.FIRST_POSITION),
            setOpeningPosition([]),
            setEvaluation([]),
        ]));
    }

    handleRedo() {

        const lastId: number = store.getState()["lastMoveId"];
        const nextMove: Node | undefined = treeService.getNextMove(lastId);

        if (nextMove && nextMove[NODE_MAP.id]) {
            store.dispatch(batchActions([
                toggleAutoplay(false),
                lastMoveId((nextMove[NODE_MAP.id] as number)),
                setPosition(nextMove[NODE_MAP.fen]),
                setOpeningPosition([]),
                setEvaluation([]),
            ]));
        }
    }

    handleToggleSubMenu() {
        store.dispatch(toogleOpenMenu());
    }

    handleLogout = () => {
        SessionManagerService.removeToken();
        SessionManagerService.removeTemporaryToken();
        location.href = "/";
    }

    handleNewGame = () => {
        store.dispatch(toogleOpenMenu(false));
        store.dispatch(addNewGame((id) => {
            store.dispatch(batchActions([
                setStatus(""),
                setWhoIsOnMove(IOnMove.WHITE),
                lastMoveId(null),
                setPosition(SmartAwesomeChessboard.FIRST_POSITION),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([]),
                setHistory([])
            ]));
            console.log("id", id);
        }));
    };

    handleNewGameFromPgn = () => {
        store.dispatch(toogleOpenMenu(false));
        store.dispatch(addNewGame((id) => {
            store.dispatch(batchActions([
                setStatus(""),
                setWhoIsOnMove(IOnMove.WHITE),
                lastMoveId(null),
                setPosition(SmartAwesomeChessboard.FIRST_POSITION),
                setEvaluation([]),
                setSyzygyEvaluation(null),
                setOpeningPosition([]),
                setHistory([])
            ]));
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
            <div className="modal" style={{display: "block", backgroundColor: '#3c3c3cb5'}} role="dialog">
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
                            version 1.2.3
                        </li>
                    </ul>
                </div>
            )

        }
    }
}

export const MenuWithRouter = withRouter(Menu);

