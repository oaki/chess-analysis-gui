import React, {FC, memo} from "react";
import { useSelector } from "../../libs/stateCompat";
import { ReduxStateShape } from "reducers";
export const WorkerEvaluation: FC<WorkerEvaluationProps> = memo(({}) => {
    const workers = useSelector((reduxState: ReduxStateShape) => {
      return reduxState.workers;
    });
    
    console.log({workers});
    return (
      <div>WorkerEvaluation</div>    
    );
});

export type WorkerEvaluationProps = {
}