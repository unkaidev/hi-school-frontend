import { loginUser, logoutUser } from "../../services/userServices";
import { toast } from "react-toastify";

// import localStorage from "redux-persist/es/storage";

export const FETCH_USER_LOGIN = 'FETCH_USER_LOGIN';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_REFRESH = 'USER_REFRESH';

export const handleLoginRedux = (username, password) => {

    return async (dispatch, getState) => {
        dispatch({ type: FETCH_USER_LOGIN });

        let response = await loginUser(username, password);
        if (response && +response.ec === 0) {
            //success
            let username = response.username;
            let email = response.email;
            let phone = response.phone;
            let schoolId = response.schoolId;
            let roles = response.roles;
            let payload = {
                isAuthenticated: true,
                account: { username, email, phone, schoolId, roles }
            }

            dispatch({
                type: FETCH_USER_SUCCESS,
                data: { payload }
            });
        }

        else {
            //error
            dispatch({
                type: FETCH_USER_ERROR
            });

        }

    }
}
export const handleLogoutRedux = () => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_LOGOUT
        })
    }
}

export const handleRefresh = () => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_REFRESH
        })
    }
}
