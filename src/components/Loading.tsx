import * as React from "react";
import {memo} from "react";

interface ILoadingProps {
    isLoading: boolean;
}

export const Loading = memo((props: ILoadingProps) => {
    if (props.isLoading) {
        return (
            <div className="full-loading">
                <div className="full-loading__img">
                    <img src="/img/chess-analysis-logo.svg" alt="chess-analysis-logo.svg"/>
                </div>
            </div>
        )
    }
    return null;
});

export const SmallLoading = memo((props:ILoadingProps) => {
    if (props.isLoading) {
        return (
            <span className="small-loading">Loading....</span>
        )
    }
    return null;
})