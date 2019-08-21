import * as React from "react";
import {memo, useEffect} from "react";
import {useFetching} from "../hooks/useFetching";

interface MyResponse {
    created_at: string;
}

export const TestHooks = memo((props: any) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InBhdm9sYmluY2lrQGdtYWlsLmNvbSIsIm5hbWUiOiJQYXZvbCBCaW5jaWsiLCJpYXQiOjE1NTc3NzAyMTQsImV4cCI6MTU3NTA1MDIxNH0.h1fK53V_68qe9g8b6bnNWsyidlgQbl47iC40-evE9g0";

    const fetchData = {
        headers: new Headers({
            Authorization: `Bearer ${token}`
        })
    };

    const url = "http://localhost:8080/user/history:last";

    const [fetchState, doFetch] = useFetching<MyResponse>(url, fetchData);

    useEffect(() => {
        doFetch();
    }, [])

    const onClick = () => {
        doFetch()
    };

    return (
        <div>
            <>
                {fetchState.isLoading && <span>loading</span>}
                {fetchState.isError && <span>Error</span>}
                {fetchState.response && <span>{fetchState.response.created_at}</span>}
                <button onClick={onClick}>Button</button>
            </>
        </div>
    )
});