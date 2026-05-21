import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import {Provider} from "react-redux";
import store from "./app/store";
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import {theme} from "./common/theme/Theme";
import {ThemeProvider} from "@mui/material/styles";
import "./assets/scss/styles.scss"
import './i18n';

export const history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </Router>
    </Provider>,
    document.getElementById("root")
);
