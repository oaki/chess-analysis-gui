import React from "react";
import {ErrorType, IErrorProps} from "../../services/errorManager";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import {faInfoCircle, faTimesCircle} from "@fortawesome/fontawesome-free-solid";

export function Error(props: Partial<IErrorProps>) {
    return (
        <div className={`alert alert-${props.type} p-lg pos-r`} role="alert" key="alert">
            <button onClick={props.handleOnClick} className="c-white f-r" data-identifier={props.identifier}>
                <FontAwesomeIcon icon={faTimesCircle}/>
            </button>
            <span className="c-white"><FontAwesomeIcon icon={faInfoCircle}/></span>
            <span className="m-l-sm">{props.msg}</span>
        </div>
    );
}

export function Info(props: Partial<IErrorProps>) {
    const newProps = {...props, type: ErrorType.INFO};
    return (
        <Error {...newProps}/>
    );
}
