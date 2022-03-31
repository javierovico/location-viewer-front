import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import 'antd/dist/antd.css';
import 'antd/dist/antd.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

ReactDOM.render(
    <React.Fragment>
        <AuthProvider>
            <BrowserRouter basename='/'>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </React.Fragment>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
