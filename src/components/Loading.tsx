import * as React from "react";
import {connect} from "react-redux";

interface ILoadingProps {
    isLoading: boolean;
}

export class Loading extends React.Component<ILoadingProps, any> {
    render() {
        if (this.props.isLoading) {
            return (
                <div className="full-loading">
                    <div className="full-loading__img">
                        <img src="/img/chess-analysis-logo.svg" alt="chess-analysis-logo.svg"/>
                    </div>
                </div>
            )
        }
        return null;
    }
}

export class SmallLoading extends React.Component<ILoadingProps, any> {
    render() {
        if (this.props.isLoading) {
            return (
                <span className="small-loading">Loadding....</span>
            )
        }
        return null;
    }
}