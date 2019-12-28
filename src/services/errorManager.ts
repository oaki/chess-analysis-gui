import {IAction} from "../interfaces";
import dotProp from "dot-prop-immutable";
import store from "../store";

export const ADD_ERROR = "ADD_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";

interface IRemoveErrorProps {
    identifier: string;
}

export enum ErrorType {
    INFO = "info",
    ERROR = "error",
}

export interface IErrorProps {
    msg: string;
    identifier?: string;
    type?: ErrorType;
    delay: number;
    expireTime?: number;
    handleOnClick: (e: any) => void
}
export function addError(props: Partial<IErrorProps>) {

    return {
        payload: {delay: 3, type: ErrorType.ERROR, ...props},
        type: ADD_ERROR
    };
}

export function addInfo(props: Partial<IErrorProps>) {

    return {
        payload: {delay: 3, ...props, type: ErrorType.INFO},
        type: ADD_ERROR
    };
}

export function removeError(props: IRemoveErrorProps) {
    return {
        payload: props,
        type: REMOVE_ERROR
    };
}


export function errorReducers(state: IErrorProps[] = [], action: IAction<IErrorProps>) {
    let index;
    switch (action.type) {
        case ADD_ERROR:
            index = state.findIndex(error => error.identifier === action.payload.identifier);
            const expireTime = ErrorManager.getNow() + action.payload.delay;
            const error = {
                ...action.payload,
                expireTime: expireTime
            };
            if (index === -1) {
                return [...state, error];
            }

            return dotProp.set(state, `${index}`, {
                    ...action.payload,
                    expireTime: expireTime
                }
            );

        case REMOVE_ERROR:
            const errors = state.filter(error => error.identifier === action.payload.identifier);

            if (errors.length > 0) {
                let newState;
                errors.forEach((error, index) => {
                    newState = dotProp.delete(newState ? newState : state, `${index}`)
                });

                return newState;
            }

            return state;


        default:
            return state;
    }
}


export class ErrorManager {

    private interval;

    constructor() {
        this.interval = setInterval(this.handler, 1000);
    }

    static getNow() {
        return Math.round(+new Date() / 1000);
    }

    handler = () => {
        const errors = store.getState()["errors"];
        const timestamp = ErrorManager.getNow();
        if (errors) {
            errors.forEach(error => {
                if (error.expireTime < timestamp) {
                    store.dispatch(removeError({identifier: error.identifier}));
                }
            })

        }
    }
}

export class Flash {
    static info(props: Partial<IErrorProps>) {
        store.dispatch(addInfo(props));
    }

    static error(props: Partial<IErrorProps>) {
        store.dispatch(addError(props));
    }
}
