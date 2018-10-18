import * as React from "react"
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import store from "../store";
import {SessionManagerService} from "../services/sessionManager";


export const PrivateRoute = ({component: Component, ...rest}) => {

    const {isLoggedIn} = store.getState()['user'];
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