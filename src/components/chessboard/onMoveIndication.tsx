import * as React from "react";
import {IOnMove} from "../../actions";
import * as classnames from 'classnames';

interface OnMoveIndicationProps {
    isFlip: boolean;
    onMove: IOnMove
}

export const OnMoveIndication = (props: OnMoveIndicationProps) => {
    const className = classnames('on-move-indicator pos-a',{
        'on-move-indicator--top': (props.onMove === IOnMove.WHITE && props.isFlip) || props.onMove === IOnMove.BLACK
    });

    return (
        <div className={className}/>
    )
}