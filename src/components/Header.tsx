import React from "react";
import { ChevronLeft} from "@emotion-icons/material";

import {Link} from "react-router-dom";

interface IHeaderProps {
    title: string;

}

export function Header(props: IHeaderProps) {
    return (
        <div className="p-sm fs-5 bg-mine-shaft2">

            <Link to="/" className="c-white d-ib fs-5 pr-sm"><ChevronLeft width={20}/></Link>

            {props.title}
        </div>
    )
}