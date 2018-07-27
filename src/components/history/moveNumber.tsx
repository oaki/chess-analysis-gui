import * as React from "react";

export interface IMoveNumberProps {
    counter: number;
    moveIndex: number
}

export function MoveNumber(props: IMoveNumberProps) {

    const isBlack = props.counter % 2 === 0;
    if (isBlack && props.moveIndex !== 0) {
        return null;
    }
    const className = ` move_num move_num_${props.counter}`;
    return (
        <span
            key={`move_${props.counter}`}
            className={className}
            id={className}
        >{isBlack && <span>.</span>}{!isBlack && getMoveNumber(props.counter)}.
        </span>
    )
}

function getMoveNumber(counter: number) {
    return Math.round((counter) / 2);
}
