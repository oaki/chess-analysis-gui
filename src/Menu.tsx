import * as React from 'react';
import {connect} from 'react-redux';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import {store} from "./store";
import {flipBoard, historyRedo, historyUndo} from "./actions";

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

    render() {
        return (
            <div className="bottom-menu">
                <ul>
                    {/*<li>www</li>*/}
                    {/*<li>2</li>*/}

                    <li><a href="#" onClick={this.handleFlipBoard}> <FontAwesomeIcon icon={faRetweet}/></a></li>
                    <li><a href="#" onClick={this.handleUndo}> <FontAwesomeIcon icon={faAngleDoubleLeft}/></a></li>
                    <li><a href="#" onClick={this.handleRedo}> <FontAwesomeIcon icon={faAngleDoubleRight}/></a></li>
                </ul>
            </div>
        )
    }
}
