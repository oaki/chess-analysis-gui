import * as React from "react"
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {store} from "../store";


export const PrivateRoute = ({component: Component, ...rest}) => {

    const state = store.getState();
    console.log('state', state);
    const {isLoggedIn, token, googleToken} = store.getState()['user'];
    const renderComponent = (props) => {

        if (isLoggedIn && token && googleToken) {
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