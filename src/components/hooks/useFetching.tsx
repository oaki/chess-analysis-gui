import {useReducer} from "react";

export enum Action {
    FETCH_INIT = "FETCH_INIT",
    FETCH_SUCCESS = "FETCH_SUCCESS",
    FETCH_FAILURE = "FETCH_FAILURE",
}

export interface FetchingState<JsonResponse> {
    isLoading: boolean;
    isError: boolean;
    response: JsonResponse;
}

export interface FetchingAction {
    payload?: any;
    type: Action;
}

function dataFetchReducer<JsonResponse>(state: FetchingState<JsonResponse>, action: FetchingAction) {
    switch (action.type) {
        case Action.FETCH_INIT:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case Action.FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                response: action.payload,
            };
        case Action.FETCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            throw new Error();
    }
}

export function useFetching<JsonResponse>(url: string, requestInit: RequestInit = {}): [FetchingState<JsonResponse>, () => void] {

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        response: null,
    });

    const doFetch = async () => {
        dispatch({type: Action.FETCH_INIT});
        try {
            const response = await fetch(url, requestInit);

            if (!response.ok) {
                throw new Error("Fetch failed response.ok === false");
            }

            const result: JsonResponse = await response.json();
            (result as any).created_at = new Date().toISOString();
            console.log({result});
            dispatch({type: Action.FETCH_SUCCESS, payload: result});
        } catch (err) {
            console.error(err);
            dispatch({type: Action.FETCH_FAILURE});
        }
    };


    return [{...state}, doFetch];
}