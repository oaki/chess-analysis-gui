import * as React from "react";
import {memo, useState} from "react";
import Toggle from "react-toggle"
import {useStockFishWorker} from "./useStockFish";
import {connect} from "react-redux";
import {IState} from "../../interfaces";


interface Props {
    lastFen
}

export const OfflineStockFishEvaluationController = memo((props: Props) => {
    const [state, setState] = useState({
        doEvaluation: false
    });
    debugger;
    const [worker, evaluation] = useStockFishWorker(props.lastFen);
    console.log({worker,evaluation});
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

                <span className="react-toggle--label">Show evaluation</span>
            </label>
        </div>
    );
});

export const SmartStockFish = connect((state: IState) => ({lastFen: state.fen}))(OfflineStockFishEvaluationController);