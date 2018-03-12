import * as React from 'react';
import {connect} from 'react-redux';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import * as faBars from "@fortawesome/fontawesome-free-solid/faBars";
import {store} from "./store";
import {flipBoard, historyRedo, historyUndo, toogleOpenMenu} from "./actions";

@connect((state) => ({isSubMenuOpen: state.menu.isSubMenuOpen}))
export class Menu extends React.Component<any, any> {

    handleFlipBoard() {
        store.dispatch(flipBoard());
    }

    handleUndo() {
        store.dispatch(historyUndo(Math.random()));
    }

    handleRedo() {
        store.dispatch(historyRedo(Math.random()));
    }

    handleToggleSubMenu() {
        console.log('handleToggleSubMenu');
        store.dispatch(toogleOpenMenu());
    }

    render() {
        console.log('this.props.isSubMenuOpen',this.props.isSubMenuOpen);
        return (
            <div className="bottom-menu">
                {this.renderSubmenu()}

                <ul className="main">
                    {/*<li>www</li>*/}
                    {/*<li>2</li>*/}

                    <li><a href="#" onClick={this.handleToggleSubMenu}> <FontAwesomeIcon icon={faBars}/></a></li>
                    <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>
                    <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>
                    <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>
                </ul>
            </div>
        )
    }

    renderSubmenu() {
        console.log('this.props.isSubMenuOpen',this.props.isSubMenuOpen);
        if (this.props.isSubMenuOpen) {
            return (
                <div className="position-relative">
                    <ul className="sub-menu">
                        <li className="sub-menu__line">
                            <button type="button" className="btn btn-link">New game</button>
                        </li>
                        <li className="">
                            <button type="button" className="btn btn-link">About</button>
                        </li>
                    </ul>
                </div>
            )

        }
    }
}
