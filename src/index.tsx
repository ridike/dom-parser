import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DomService } from 'domService'
import { DomServiceContext } from 'context'

const domService = new DomService()

ReactDOM.render(
  <DomServiceContext.Provider value={domService}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DomServiceContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
