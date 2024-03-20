import { FETCH_USER_ERROR, FETCH_USER_SUCCESS, FETCH_USER_LOGIN, USER_LOGOUT, USER_REFRESH } from "../actions/userAction";
// import localStorage from "redux-persist/es/storage";

const INITIAL_STATE = {
    dataRedux: {
        isAuthenticated: false,
        account: {},

    },
    isLoading: true,
    isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case FETCH_USER_LOGIN:

            return {

                ...state,
                isLoading: true,
                isError: false
            };

        case FETCH_USER_ERROR:

            return {
                ...state,
                isLoading: true,
                isError: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state, dataRedux: {
                    isAuthenticated: action.data.payload.isAuthenticated,
                    account: action.data.payload.account,
                },

                isLoading: false,
                isError: false,
            };

        case USER_LOGOUT:
            localStorage.removeItem('hischool');
            return {
                ...state, dataRedux: {
                    isAuthenticated: false,
                    account: {},
                },
                isLoading: true,
                isError: false

            }
        case USER_REFRESH:

            return {
                ...state,
            }
        default:
            return state;

    }

};

export default userReducer;