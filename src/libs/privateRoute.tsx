import * as React from "react"
import {Redirect, Route} from "react-router-dom"
import store from "../store";

export const PrivateRoute = ({component: Component, ...rest}) => {

    const state = store.getState();
    const isLoggedIn = state.user.isLoggedIn;
    const renderComponent = (props) => {

        if (isLoggedIn) {
            return <Component {...props} />;
        }

        const redirectProps = {
            pathname: "/auth/sign-in",
            state: {from: props.location}
        };


        return (
            <Redirect to={redirectProps}/>
        )
    };

    return (
        <Route {...rest} render={renderComponent}/>
    );
};