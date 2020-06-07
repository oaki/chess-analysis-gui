import * as React from "react";
import {FC, memo, useCallback} from "react";
import {useSelector} from "react-redux";
import {Error} from "./error";
import store from "../../store";
import {IErrorProps, removeError} from "../../services/errorManager";
import {IState} from "../../interfaces";

export const ErrorController: FC<ErrorContainerProps> = memo((props: ErrorContainerProps) => {
    const errors = useSelector((state: IState) => {
        return state.errors;
    });

    return <Errors errors={errors}/>;
});

export const Errors: FC<ErrorsProps> = memo(({errors}) => {

    const handleCloseClick = useCallback((e: any) => {
        e.preventDefault();
        const key = e.currentTarget.dataset.identifier;
        store.dispatch(removeError({identifier: key}));
    }, []);

    return (
        <div className="error-container pos-r">
            <div className="pos-a l-0 r-0 b-0">
                {errors.map((error, index) => (
                    <Error key={`error_${index}`} {...error} handleOnClick={handleCloseClick}/>))}
            </div>
        </div>
    );
});

type ErrorsProps = {
    errors: IErrorProps[];
}
type ErrorContainerProps = {

}
