import {useCallback, useEffect, useReducer, useRef} from "react";
import {Nullable} from "../../interfaces";

/**
 * Example
 */

/*
export const TestFetchHooks = memo((props: any) => {
    const url = "http://localhost:8080/user/history:last";
    const [fetchState, doFetch] = useFetch<MyResponse>();

    useEffect(() => {
        doFetch(url);
    }, [doFetch, url])
    const clickHandler = () => doFetch(url);
    return (
        <>
            {fetchState.isLoading && <span>loading</span>}
            {fetchState.isError && <span>Error</span>}
            {fetchState.response && <span>{fetchState.response.created_at}</span>}
            <button onClick={clickHandler}>Button</button>
        </>
    )
});

interface MyResponse{
    created_at:string;
}
*/
export enum Action {
    FETCH_INIT = 'FETCH_INIT',
    FETCH_SUCCESS = 'FETCH_SUCCESS',
    FETCH_FAILURE = 'FETCH_FAILURE',
}

export interface UseFetchState<JsonResponse> {
    isLoading: boolean;
    isError: boolean;
    response: Nullable<JsonResponse>;
}

export interface UseFetchAction<JsonResponse> {
    payload?: JsonResponse;
    type: Action;
}

export type ResponseType = 'json' | 'text';

export type UseFetchCallbackFn = (url: string, requestInit?: RequestInit) => Promise<void>;

function dataFetchReducer<JsonResponse>(state: UseFetchState<JsonResponse>, action: UseFetchAction<JsonResponse>): UseFetchState<JsonResponse> {
    switch (action.type) {
        case Action.FETCH_INIT:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case Action.FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                response: action.payload || null,
            };
        case Action.FETCH_FAILURE:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            return state;
    }
}

export function useFetch<ResponseInterface>(responseType: ResponseType = 'json'): [UseFetchState<ResponseInterface>, UseFetchCallbackFn] {
    const cancel = useRef(false);
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        response: null,
    });

    const doFetch: UseFetchCallbackFn = useCallback(
        async (url: string, requestInit: RequestInit = {}): Promise<void> => {
            dispatch({type: Action.FETCH_INIT});
            try {
                const response: Response = await fetch(url, requestInit);
                if (cancel.current) {
                    return;
                }

                if (!response.ok) {
                    throw new Error('Fetch failed response.ok === false');
                }

                let result:Nullable<boolean> = null;
                if (requestInit?.method === 'HEAD') {
                    result = true;
                } else {
                    result = await response[responseType]();
                }

                dispatch({type: Action.FETCH_SUCCESS, payload: result});
            } catch (err) {
                console.error(err);
                dispatch({type: Action.FETCH_FAILURE});
            }
        },
        [dispatch, responseType],
    );

    useEffect(() => {
        return () => {
            cancel.current = true;
        };
    }, []);
    return [{...state} as UseFetchState<ResponseInterface>, doFetch];
}

