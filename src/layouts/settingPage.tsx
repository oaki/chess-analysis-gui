import * as React from "react";
import {connect} from "react-redux";
import {MenuWithRouter} from "../components/menu/menu";
import {Header} from "../components/Header";
import Toggle from "react-toggle"
import {IAction} from "../interfaces";
import store from "../store";

@connect((state) => ({
    settings: state.settings
}))
export class SettingPage extends React.PureComponent<any, undefined> {

    handleToggleShowEvaluation = () => {
        store.dispatch(toggleShowEvaluation());
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
                                        defaultChecked={this.props.settings.showEvaluation}
                                        icons={false}
                                        onChange={this.handleToggleShowEvaluation}
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

interface ISettings {
    showEvaluation: boolean;
}

export const TOGGLE_EVALUATION = "settings/showEvaluation";

export function toggleShowEvaluation() {
    return {
        type: TOGGLE_EVALUATION
    };
}

export const settingsReducer = (settings: ISettings = {
    showEvaluation: true
}, action: IAction<ISettings>) => {

    switch (action.type) {
        case TOGGLE_EVALUATION:
            console.log("actionactionaction", action);
            return {...settings, showEvaluation: !settings.showEvaluation};

        default:
            return settings;
    }
};


