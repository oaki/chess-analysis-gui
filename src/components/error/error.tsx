import React from "react";
import {ErrorType, IErrorProps} from "../../services/errorManager";
import { Close, Info as InfoIcon } from "@emotion-icons/material";

export function Error(props: Partial<IErrorProps>) {
    return (
        <div className={`alert alert-${props.type} p-lg pos-r`} role="alert" key="alert">
            <button onClick={props.handleOnClick} className="c-white f-r" data-identifier={props.identifier}>
                <Close width={16}/>
            </button>
            <span className="c-white"><InfoIcon width={16}/></span>
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
