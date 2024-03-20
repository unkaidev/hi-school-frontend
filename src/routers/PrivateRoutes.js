import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

const PrivateRoutes = ({ component: Component, requiredRoles, roles, ...rest }) => {
    const isAuthenticated = useSelector(state => state.user.dataRedux.isAuthenticated);
    return (
        <Route
            {...rest}
            render={props => {
                if (isAuthenticated) {
                    if (!requiredRoles || requiredRoles.length === 0 || requiredRoles.some(role => roles.includes(role))) {
                        return <Component {...props} />;
                    } else {
                        return <Redirect to="/login" />;
                    }
                } else {
                    return <Redirect to='/login' />;
                }
            }}
        />
    );
};

export default PrivateRoutes;
