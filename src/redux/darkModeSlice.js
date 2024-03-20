import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        darkMode: false,
    },
    reducers: {
        toggleDarkMode: state => {
            state.darkMode = !state.darkMode;
        },
        setDarkMode: state => {
            state.darkMode = true;
        },
        setLightMode: state => {
            state.darkMode = false;
        },
    },
});

export const { toggleDarkMode, setDarkMode, setLightMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
