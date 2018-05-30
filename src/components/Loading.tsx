import * as React from "react";
import {connect} from "react-redux";

interface ILoadingProps {
    isLoading: boolean;
}

function mapStateToProps(state: any) {
    return {
        isLoading: state.isLoading
    }
}

@connect(mapStateToProps)
export class Loading extends React.Component<ILoadingProps, any> {
    render() {
        if (this.props.isLoading) {
            return <div className="alert alert-danger">{this.props.isLoading}</div>
        }
        return null;
    }
}