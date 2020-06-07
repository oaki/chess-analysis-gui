import * as React from "react";
import {memo, useState} from "react";
import Toggle from "react-toggle"
import {useStockFishWorker} from "./useStockFish";
import {shallowEqual, useSelector} from "react-redux";
import {IState} from "../../interfaces";
import {treeService} from "../moveTree/tree";
import {Eval} from "./evaluation";

type ControllerProps = {}

export const SmartStockFish = memo((props: ControllerProps) => {
    const [state, setState] = useState({
        doEvaluation: false
    });

    const {lastFen, lastMoveId} = useSelector((state: IState) => ({
        lastFen: state.fen,
        lastMoveId: state.lastMoveId
    }), shallowEqual);

    return (
        <div>
            <label>
                <Toggle
                    defaultChecked={state.doEvaluation}
                    icons={false}
                    onChange={() => {
                        setState({
                                doEvaluation: !state.doEvaluation
                            }
                        )
                    }}
                />

                <span className="react-toggle--label">Local</span>
            </label>

            {state.doEvaluation && <OfflineStockFishEvaluation lastMoveId={lastMoveId} lastFen={lastFen}/>}
        </div>
    );
});

type OfflineStockFishEvaluationProps = {
    lastMoveId: number;
    lastFen: string;
}
const OfflineStockFishEvaluation = memo((props: OfflineStockFishEvaluationProps) => {
    const movesLine = treeService.getMoveLine(props.lastMoveId);
    const [worker, evaluations] = useStockFishWorker(props.lastFen, movesLine);
    console.log({worker, evaluations});

    return (
        <div>
            {evaluations && <Eval
              evaluations={evaluations}
              fen={props.lastFen}
              name={"Local"}
            />}
        </div>
    )
})