import * as React from "react";
import {connect, Provider} from "react-redux";
import {Route, Router, Switch} from "react-router"
import {BrowserRouter} from "react-router-dom"
import {MenuWithRouter} from "../components/menu/menu";
import {Header} from "../components/Header";
import {Checkbox, Form} from "informed";
import Toggle from "react-toggle"


export class SettingPage extends React.PureComponent<any, undefined> {

    handleTofuChange = () => {
        console.log("handleTofuChange");
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Header title="Settings"/>

                        <div className="row p-t-md">
                            <div className="col-md-12">
                                <label>

                                    <Toggle
                                        defaultChecked={this.props.tofuIsReady}
                                        icons={false}
                                        onChange={this.handleTofuChange}
                                    />

                                    <span className="react-toggle--label">Show evaluation</span>
                                </label>
                            </div>
                        </div>

                    </div>

                    <MenuWithRouter showMainMenu={true}/>
                </div>
            </div>
        );
    }

}


