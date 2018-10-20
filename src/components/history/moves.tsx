import {Node, NODE_MAP, NodeVariant} from "../moveTree/tree";
import * as React from "react";
import {MoveNumber} from "./moveNumber";
import {Styles} from "@fortawesome/fontawesome";

interface IVariants {
    variants: NodeVariant[];
    counter: number;
    level: number;
    lastMoveId: number;
    handleMoveClick: (e: any) => void;
}

export interface IMoves {
    counter: number;
    showBracket: boolean;
    moves: Node[];
    level: number;
    handleMoveClick: (e: any) => void;
    lastMoveId: number;
}

export function Variants(props: IVariants) {


    const variants = props.variants.map((variant: NodeVariant, index: number) => {
        return [
            <Moves
                key={index}
                counter={props.counter - 1}
                moves={variant[NODE_MAP.moves]}
                level={props.level + 1}
                handleMoveClick={props.handleMoveClick}
                showBracket={true}
                lastMoveId={props.lastMoveId}
            />
        ];
    });

    if (props.variants.length > 1) {
        return (
            <div>{variants}</div>
        )
    } else {
        return variants;
    }
}

export function Moves(props: IMoves) {
    let counter = props.counter;
    return props.moves.map((move: Node, moveIndex: number) => {
        const variantsLength: number = move[NODE_MAP.variants].length;
        const hasVariants: boolean = variantsLength > 0;
        let className = "move";
        let showLeftBracket = false;
        let showRightBracket = false;

        if (props.showBracket) {
            if (moveIndex === 0) {
                showLeftBracket = true;
            }

            if (moveIndex === props.moves.length - 1) {
                showRightBracket = true;
            }
        }

        counter++;

        const style: Styles = {};

        if (move[NODE_MAP.id] === props.lastMoveId) {
            style.color = "#99ff98";
        }

        if (hasVariants && variantsLength === 1) {

        }

        className += ` l-${props.level > 1 ? 2 : props.level}`;

        return (
            <React.Fragment key={moveIndex}>
                <div
                    className={className}
                    style={style}
                    key={moveIndex}
                    onClick={props.handleMoveClick}
                    data-id={move[NODE_MAP.id]}
                >
                    {showLeftBracket && "("}
                    <MoveNumber counter={counter} moveIndex={moveIndex}/>
                    <span>{move[NODE_MAP.shortNotation]}</span>
                    {showRightBracket && ")"}
                </div>

                <Variants
                    key={`variant_${move[NODE_MAP.id]}`}
                    variants={move[NODE_MAP.variants]}
                    level={props.level}
                    lastMoveId={props.lastMoveId}
                    counter={counter}
                    handleMoveClick={props.handleMoveClick}
                />
            </React.Fragment>
        )
    })
}