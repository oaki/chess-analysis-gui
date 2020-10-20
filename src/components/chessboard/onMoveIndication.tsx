import React from "react";
import {IOnMove} from "../../actions";
import * as classnames from "classnames";
import {isYourMove} from "../../tools/isYourMove";

interface OnMoveIndicationProps {
    isFlip: boolean;
    onMove: IOnMove
}

export const OnMoveIndication = (props: OnMoveIndicationProps) => {
    const className = classnames("on-move-indicator pos-a", {
        "on-move-indicator--top": !isYourMove(props.onMove, props.isFlip)
    });

    return (
        <div className={className}/>
    )
}