import * as React from 'react';
import {connect} from 'react-redux';
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
        console.log('moves', moves);
        console.log('hanfleHistory', previousMove);
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
        console.log('handleToggleSubMenu');
        store.dispatch(toogleOpenMenu());
    }

    handleLogout() {
        console.log('handleLogout');
        SessionManagerService.removeUser();

        location.reload();
    }

    handleNewGame() {
        console.log('handleNewGame');
        store.dispatch(addNewGame());
    }

    render() {
        console.log('this.props.isSubMenuOpen', this.props.isSubMenuOpen);
        return (
            <div className="bottom-menu">
                {this.renderSubmenu()}

                <ul className="main">
                    <li><a href="#" onClick={this.handleToggleSubMenu}> <FontAwesomeIcon icon={faBars}/></a></li>
                    <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>
                    <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>
                    <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>
                </ul>
            </div>
        )
    }

    renderSubmenu() {
        console.log('this.props.isSubMenuOpen', this.props.isSubMenuOpen);
        if (this.props.isSubMenuOpen) {
            return (
                <div className="position-relative">
                    <ul className="sub-menu">
                        <li className="sub-menu__line">
                            <button onClick={this.handleNewGame} type="button" className="btn btn-link">New game</button>
                        </li>
                        <li className="sub-menu__line">
                            <button type="button" className="btn btn-link">About</button>
                        </li>
                        <li className="sub-menu__line">
                            <a href="/user/engines" type="button" className="btn btn-link">My chess engines</a>
                        </li>
                        <li className="">
                            <button onClick={this.handleLogout} type="button" className="btn btn-link">Logout</button>
                        </li>
                    </ul>
                </div>
            )

        }
    }
}
