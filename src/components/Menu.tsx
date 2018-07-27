import * as React from "react";
import * as ReactDOM from "react-dom";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import * as faBars from "@fortawesome/fontawesome-free-solid/faBars";
import {store} from "../store";
import {addNewGame, flipBoard, setEvaluation, setOpeningPosition, setPosition} from "../actions";
import {SessionManagerService} from "../services/sessionManager";
import {batchActions} from "redux-batched-actions";
import {Node, NODE_MAP, treeService} from "./moveTree/tree";
import {lastMoveId} from "./history/History";
import {SmartAwesomeChessboard} from "./chessboard/chessboard";
import {IAction} from "../interfaces";

@connect((state) => ({
    isOpen: state.menu.isOpen
}))
export class Menu extends React.Component<any, any> {

    handleFlipBoard() {
        store.dispatch(flipBoard());
    }

    handleUndo() {

        const lastMove = store.getState()["lastMoveId"];
        const previousMove: Node | undefined = treeService.getPrevMove(lastMove);

        let id: number | null = null;
        if (previousMove && previousMove[NODE_MAP.id]) {
            id = (previousMove[NODE_MAP.id] as number);
        }
        store.dispatch(batchActions([
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
                lastMoveId((nextMove[NODE_MAP.id] as number)),
                setPosition(nextMove[NODE_MAP.fen]),
                setOpeningPosition([]),
                setEvaluation([]),
            ]));
        }
        /*
                const nextMove = getHistoryNextMove();
                if (nextMove) {
                    store.dispatch(batchActions([
                        lastMoveId(nextMove.uuid),
                        setPosition(nextMove.fen),
                        setOpeningPosition([]),
                        setEvaluation([]),
                    ]));
                }
                */
    }

    handleToggleSubMenu() {
        store.dispatch(toogleOpenMenu());
    }

    handleLogout = () => {
        SessionManagerService.removeUser();
        this.props.history.push("/auth/sign-in");
    }

    handleNewGame = () => {
        const props = this.props;
        store.dispatch(addNewGame((id) => {
            // props.history.push(`/#game_${id}`);
            window.location.href = "/";
        }));
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


    render() {
        const btnClasses = "btn btn-link btn-block";
        console.log("this.props.isSubMenuOpen", this.props.isSubMenuOpen);
        return (
            <div className="bottom-menu">
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
                        ><FontAwesomeIcon icon={faRetweet}/>
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
        console.log("handleBeforeGoToList");
        store.dispatch(toogleOpenMenu());
    }

    renderSubmenu() {

        if (this.props.isOpen) {
            return (
                <div className="position-relative">
                    <ul className="sub-menu">
                        <li className="sub-menu__line">
                            <a href="#" onClick={this.handleNewGame}>New game</a>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/user/history" onClick={this.handleBeforeGoToList}>History</Link>
                        </li>
                        <li className="sub-menu__line">
                            <Link to="/user/engines" onClick={this.handleBeforeGoToList}>My chess engines</Link>
                        </li>
                        <li className="">
                            <a onClick={this.handleLogout} href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            )

        }
    }
}

export const MenuWithRouter = withRouter(Menu);
export const MENU_TOGGLE_OPEN = "MENU_TOGGLE_OPEN";


export function toogleOpenMenu(isOpen: boolean | null = null) {
    return {
        payload: {isOpen},
        type: MENU_TOGGLE_OPEN
    };
}

export interface IMenu {
    isOpen: boolean;
}

export const menuReducer = (menu: IMenu = {isOpen: false}, action: IAction<Partial<IMenu>>) => {
    switch (action.type) {
        case MENU_TOGGLE_OPEN:
            const m = {...menu};
            if (action.payload.isOpen) {
                m.isOpen = action.payload.isOpen;
            } else {
                m.isOpen = !m.isOpen;
            }

            return m;

        default:
            return menu;
    }
};