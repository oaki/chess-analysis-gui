import * as React from 'react';

interface IHeaderProps {
    title: string;
}

export const Header = (props: IHeaderProps) => {
    return (
        <div className="header p-sm fs-sm p-l-0 c-white">
            {props.title}
        </div>
    )
}