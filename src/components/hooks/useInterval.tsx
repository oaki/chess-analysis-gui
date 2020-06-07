import React, {useEffect, useRef} from "react";

type IntervalFunction = () => (unknown | void)

export function useInterval(callback: IntervalFunction, delay: number) {
    const savedCallback = useRef<IntervalFunction | null>(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current && savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}