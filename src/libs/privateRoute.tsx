import * as React from "react"
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {store} from "../store";


export const PrivateRoute = ({component: Component, ...rest}) => {

    const {isLoggedIn, token} = store.getState()['user'];
    const renderComponent = (props) => {

        if (isLoggedIn && token) {
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