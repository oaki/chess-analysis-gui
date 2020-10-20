import React from "react";
import * as ReactDOM from "react-dom";
// import * as Sentry from '@sentry/browser';
import registerServiceWorker from "./registerServiceWorker";
import "normalize.css";
import "functional-css-framework/dist/functional-css.min.css";
import './assets/css/bootstrap/bootstrap-custom-modal.css';
import './assets/css/react-toggle.css';
import './assets/css/colors.css';
import './assets/css/btn.css';
import './assets/css/onMoveIndicator.css';
import './assets/css/awesomeBoard.css';
import './assets/css/promotionDialog.css';
import './assets/css/bottomMenu.css';
import './assets/css/evaluation.css';
import './assets/css/page.css';
import './assets/css/pageSingIn.css';
import './assets/css/progressBar.css';
import './assets/css/list.css';
import './assets/css/alert.css';
import './assets/css/fullLoading.css';
import './assets/css/infoPanel.css';
import './assets/css/app.css';

import onlineIndicator from "./services/onlineIndicator";
import {ChessApp} from "app";

console.log("process.env", process.env);
// Sentry.init({dsn: "https://319a79476069422db64e50c354eb4682@sentry.io/1836755"});

onlineIndicator();

const appEl = document.getElementById("root");
if (!appEl) {
    throw new Error("Root element is missing");
}
ReactDOM.render(<ChessApp/>, appEl);

registerServiceWorker();
