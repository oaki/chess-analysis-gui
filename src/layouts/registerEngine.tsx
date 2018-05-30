import * as React from 'react';
import {Provider,connect} from 'react-redux';
import {store} from "./../store";

export class RegisterEnginePage extends React.Component<any, any> {

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-7">test</div>
                    <div className="col-md-5">test</div>
                </div>
            </div>
        );
    }
}



function mapStateToProps(state) {
    return {
        msg: state.error
    }
}

export const SmartRegisterEnginePage = connect(mapStateToProps)(Error);

