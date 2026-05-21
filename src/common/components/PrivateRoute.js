import React from "react";
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import {authSelector} from "../../features/auth/authSlice";

const PrivateRoute = ({component: Component, ...rest}) => {
    const {isAuth} = useSelector(authSelector);

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuth ? <Component {...props} /> : <Redirect to="/login"/>
            }
        />
    );
};

export default PrivateRoute;
