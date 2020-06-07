import * as React from "react";
import {faArrowLeft} from "@fortawesome/fontawesome-free-solid";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

interface IHeaderProps {
    title: string;

}

export function Header(props: IHeaderProps) {
    return (
        <div className="p-sm fs-5 bg-mine-shaft2">

            <Link to="/" className="c-white d-ib fs-5 pr-sm"><FontAwesomeIcon icon={faArrowLeft}/></Link>

            {props.title}
        </div>
    )
}