import React, {memo} from "react";
import {connect} from "../libs/stateCompat";
import {MenuWithRouter} from "../components/menu/menu";
import {Header} from "../components/Header";
import Toggle from "react-toggle"
import { store } from "../store";
import { toggleShowEvaluation, type SettingsState } from "./settingPageReducers";
import type { ReduxStateShape } from "../reducers";

const mapStateToProps = (state: ReduxStateShape) => ({
    settings: state.settings
});

function handleToggleShowEvaluation() {
    store.dispatch(toggleShowEvaluation());
}

type SettingPageInnerProps = { settings: SettingsState };

const Sp = memo((props: SettingPageInnerProps) => {
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

export { TOGGLE_EVALUATION, toggleShowEvaluation, settingsReducer } from "./settingPageReducers";

export const SettingPage = connect(mapStateToProps)(Sp);
