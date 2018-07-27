import * as React from "react";

export interface ILeftBracketProps {
    moveIndex: number;
}

export interface IRightBracketProps extends ILeftBracketProps {
    lastIndex: number;
}

export function LeftBracket(props: ILeftBracketProps) {
    if (props.moveIndex === 0) {
        return (<span>{'('}</span>);
    }

    return null;

}

export function RightBracket(props: IRightBracketProps) {

    if (props.moveIndex === props.lastIndex) {
        return (<span>{')'}</span>);
    }

    return null;

}
