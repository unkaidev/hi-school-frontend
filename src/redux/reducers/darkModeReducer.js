const INITIAL_STATE = {
    darkMode: false,
};

const darkModeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'TOGGLE_DARK_MODE':
            return {
                ...state,
                darkMode: !state.darkMode,
            };
        case 'SET_DARK_MODE':
            return {
                ...state,
                darkMode: true,
            };
        case 'SET_LIGHT_MODE':
            return {
                ...state,
                darkMode: false,
            };
        default:
            return state;
    }
};

export default darkModeReducer;
