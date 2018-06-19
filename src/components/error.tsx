import * as React from "react";
import {connect} from 'react-redux';

@connect((state) => ({
    msg: state.error
}))
export class SmartError extends React.PureComponent<any, any> {
    render() {
        if (this.props.msg === '') {
            return null;
        }
        return (
            <div className="alert alert-danger">
                {this.props.msg}
            </div>
        )
    }
}