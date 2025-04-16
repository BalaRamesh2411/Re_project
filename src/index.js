import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './Routes/store';
import Nav from './Pages/Navbar/nav'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
   
    <main className="main-content  mt-0">
    {/* <Nav /> */}
    <div className="page-header align-items-start min-vh-100">
      <span className="mask bg-gradient-dark opacity-6"></span>
      <div className="container my-auto">
         <App />
      </div>
      
    </div>
  </main>
     
    </React.StrictMode>
  </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
