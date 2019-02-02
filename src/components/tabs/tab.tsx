import * as React from "react";

export class Tab extends React.PureComponent<any, any> {
    handleClick(event) {
        event.preventDefault();
        this.props.onClick(this.props.tabIndex);
    }

    render() {
        return (
            <li className="tab">
                <a
                    className={`tab-link ${this.props.linkClassName} ${this.props.isActive ? "active" : ""}`}
                    onClick={this.handleClick}
                >
                    <i className={`tab-icon ${this.props.iconClassName}`}/>
                </a>
            </li>
        )
    }

}