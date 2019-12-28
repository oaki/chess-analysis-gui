import {useCallback, useState} from "react";
import {Nullable} from "../../interfaces";


export function useRefCallback<T>(): [Nullable<T>, (node: T) => void] {
    const [node, setNode] = useState<Nullable<T>>(null);
    const setRef = useCallback((element: T) => {
        setNode(element);
    }, []);

    return [node, setRef];
}
