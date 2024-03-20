import "./style/dark.scss";
import AppRoutes from "./routers/AppRoutes";
import { ToastContainer } from 'react-toastify'
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {


    const darkMode = useSelector(state => state.darkMode.darkMode);
    return (
        <div className={darkMode ? "app dark" : "app"}>
            <Router>
                <>
                    <div className='app-container'>
                        <AppRoutes />
                    </div>
                </>

            </Router>


            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>

    );
}

export default App;
