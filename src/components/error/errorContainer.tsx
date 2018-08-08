import * as React from "react";
import {connect} from "react-redux";
import {Error} from "./error";
import store from "../../store";
import {removeError} from "../../services/errorManager";

@connect((state) => ({errors: state.errors}))
export class ErrorContainer extends React.PureComponent<any, any> {

    handleCloseClick = (e) => {
        e.preventDefault();
        console.log({e});
        console.log(e.currentTarget.dataset.identifier);
        const key = e.currentTarget.dataset.identifier;
        store.dispatch(removeError({identifier: key}));
    }

    render() {
        return (
            <div className="error-container pos-r">
                <div className="pos-a l-0 r-0 b-0">
                    {this.props.errors.map((error, index) => (
                        <Error key={`error_${index}`}{...error} handleOnClick={this.handleCloseClick}/>))}
                </div>
            </div>
        );
    }
}
