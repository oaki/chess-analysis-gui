import * as React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import * as faBars from "@fortawesome/fontawesome-free-solid/faBars";
import {store} from "../store";
import {addNewGame, flipBoard, lastMoveId, setPosition, toogleOpenMenu} from "../actions";
import {
    getHistoryNextMove, getHistoryParents,
    getHistoryPreviousMove
} from "../libs/chessboardUtils";
import {SmartAwesomeChessboard} from "./AwesomeChessboard";
import {SessionManagerService} from "../services/sessionManager";

@connect((state) => ({
    isSubMenuOpen: state.menu.isSubMenuOpen
}))
export class Menu extends React.Component<any, any> {

    handleFlipBoard() {
        store.dispatch(flipBoard());
    }

    handleUndo() {

        const moves = getHistoryParents(store.getState()['lastMoveId']);
        const previousMove = getHistoryPreviousMove();

        if (previousMove) {
            store.dispatch(setPosition(previousMove.fen));
            store.dispatch(lastMoveId(previousMove.uuid));
        } else {
            store.dispatch(setPosition(SmartAwesomeChessboard.FIRST_POSITION));
            store.dispatch(lastMoveId(''));
        }
    }

    handleRedo() {

        const nextMove = getHistoryNextMove();
        if (nextMove) {
            store.dispatch(setPosition(nextMove.fen));
            store.dispatch(lastMoveId(nextMove.uuid));
        }
    }

    handleToggleSubMenu() {
        store.dispatch(toogleOpenMenu());
    }

    handleLogout = () => {
        SessionManagerService.removeUser();
        this.props.history.push('/user/sign-in');
    }

    handleNewGame = () => {
        const props = this.props;
        store.dispatch(addNewGame(() => {
            props.history.push('/');
        }));
    }

    render() {
        console.log('this.props.isSubMenuOpen', this.props.isSubMenuOpen);
        return (
            <div className="bottom-menu">
                {this.renderSubmenu()}

                <ul className="main">
                    {this.props.showMainMenu &&
                    <li><a href="#" onClick={this.handleToggleSubMenu}> <FontAwesomeIcon icon={faBars}/></a></li>}
                    {this.props.showFlip &&
                    <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>}
                    {this.props.showUndo &&
                    <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>}
                    {this.props.showRedo &&
                    <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>}
                </ul>
            </div>
        )
    }

    handleBeforeGoToList = () => {
        console.log('handleBeforeGoToList');
        store.dispatch(toogleOpenMenu());
    }

    renderSubmenu() {

        if (this.props.isSubMenuOpen) {
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