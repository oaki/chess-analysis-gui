import * as React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {connect} from 'react-redux';

export class HomePage extends React.Component<any, any> {

    render() {


        return (
            <div>
                <a href="play">play</a>
            </div>
        );
    }
}