import * as React from "react";
import {useCallback} from "react";
import {connect} from "react-redux";
import {Error} from "./error";
import store from "../../store";
import {IErrorProps, removeError} from "../../services/errorManager";

function Container(props: ErrorContainerProps) {

    const handleCloseClick = useCallback((e: any) => {
        e.preventDefault();
        const key = e.currentTarget.dataset.identifier;
        store.dispatch(removeError({identifier: key}));
    }, []);

    return (
        <div className="error-container pos-r">
            <div className="pos-a l-0 r-0 b-0">
                {props.errors.map((error, index) => (
                    <Error key={`error_${index}`} {...error} handleOnClick={handleCloseClick}/>))}
            </div>
        </div>
    );
};

export const ErrorContainer = connect((state: any) => {
    return {
        errors: state.errors
    }
})(Container);

interface ErrorContainerProps {
    errors: IErrorProps[];
}
