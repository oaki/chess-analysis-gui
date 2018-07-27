import * as React from "react";
import {faArrowLeft} from "@fortawesome/fontawesome-free-solid";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

interface IHeaderProps {
    title: string;

}

export function Header(props: IHeaderProps) {
    return (
        <div className="row header p-sm fs-4 bg-mine-shaft2">

            <Link to="/" className="c-white fs-5 m-r-md"><FontAwesomeIcon icon={faArrowLeft}/></Link>

            {props.title}
        </div>
    )
}