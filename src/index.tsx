import * as React from "react";
import * as ReactDOM from "react-dom";
// import * as Sentry from '@sentry/browser';
import registerServiceWorker from "./registerServiceWorker";
import "normalize.css";
import "functional-css-framework/dist/functional-css.min.css";
import "./assets/css/index.css";
import onlineIndicator from "./services/onlineIndicator";
import App from "./app";

console.log(process.env);
// Sentry.init({dsn: "https://319a79476069422db64e50c354eb4682@sentry.io/1836755"});

onlineIndicator();

const appEl = document.getElementById("root");
if (!appEl) {
    throw new Error("Root element is missing");
}
ReactDOM.render(<App/>, appEl);

registerServiceWorker();
