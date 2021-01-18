import React, {FC, memo} from "react";
import { useSelector } from "react-redux";
import { IState } from "interfaces";
export const WorkerEvaluation: FC<WorkerEvaluationProps> = memo(({}) => {
    const workers = useSelector<IState>((reduxState)=>{
      return reduxState.workers;
    });
    
    console.log({workers});
    return (
      <div>WorkerEvaluation</div>    
    );
});

export type WorkerEvaluationProps = {
}