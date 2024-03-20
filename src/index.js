import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/Store";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </PersistGate>

    </Provider>
    ,
    document.getElementById('root'
    )
)
    ;

