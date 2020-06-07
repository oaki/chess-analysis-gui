import * as React from "react";
import {memo} from "react";
import {connect} from "react-redux";
import {MenuWithRouter} from "../components/menu/menu";
import {Header} from "../components/Header";
import Toggle from "react-toggle"
import {IAction} from "../interfaces";
import store from "../store";

const mapStateToProps = (state) => ({
    settings: state.settings
});

function handleToggleShowEvaluation() {
    store.dispatch(toggleShowEvaluation());
}

const Sp = memo((props: any) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <Header title="Settings"/>

                    <div className="p-sm">
                        <label>
                            <Toggle
                                defaultChecked={props.settings.showEvaluation}
                                icons={false}
                                onChange={handleToggleShowEvaluation}
                            />

                            <span className="react-toggle--label">Show evaluation</span>
                        </label>

                    </div>

                </div>

                <MenuWithRouter showMainMenu={true}/>
            </div>
        </div>
    );
});

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

export const SettingPage = connect(mapStateToProps)(Sp);

