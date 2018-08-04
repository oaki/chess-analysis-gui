import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from "./store";
console.log('index->store',store);

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './assets/css/index.css';


ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
