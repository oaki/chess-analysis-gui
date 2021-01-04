import React, {FC, memo} from "react";

export const MoveNumber: FC<IMoveNumberProps> = memo(({fen, counter}) => {
    const tokens = fen.split(/\s+/);
    const moveNumber = tokens[5];
    const isBlack = tokens[1] === "b";
    const className = ` move_num move_num_${counter}`;

    if (!isBlack) {
        return null;
    }
    return (isBlack &&
      <span
        key={`move_${counter}`}
        className={className}
        id={className}
      >{moveNumber}.</span>
    )
})

export type IMoveNumberProps = {
    fen: string;
    counter: number;
}