import {useCallback, useEffect, useState} from 'react';
import debounce from 'lodash/debounce';
import {Nullable} from "interfaces";

export function useElementResize(element: Nullable<Element>, delay = 300): UseElementResize {
    const [sizes, setSizes] = useState(() => {
        const width = element?.clientWidth ?? 0;
        const height = element?.clientHeight ?? 0;

        return {width, height};
    });

    const setSize = useCallback((): void => {
        if (!element) return;

        setSizes((prevState) => {
            if (prevState.width !== element.clientWidth || prevState.height !== element.clientHeight) {
                return {
                    width: element.clientWidth,
                    height: element.clientHeight,
                };
            }
            return prevState;
        });
    }, [element]);

    useEffect(() => {
        if (!element) return;

        setSize();

        const onResize = debounce(setSize, delay);

        window.addEventListener('resize', onResize);

        return (): void => {
            window.removeEventListener('resize', onResize);
        };
    }, [element, delay, setSize]);

    return [sizes, setSize];
}

export function ContainerSizes(props: ContainerSizesProps) {
    const [sizes] = useElementResize(props.element, props.delay);
    return props.children(sizes);
}

export type UseElementResize = [{width: number; height: number}, () => void];

type ContainerSizesChildren = (props: {width: number; height: number}) => any;

export interface ContainerSizesProps {
    element: Element;
    delay?: number;
    children: ContainerSizesChildren;
}
