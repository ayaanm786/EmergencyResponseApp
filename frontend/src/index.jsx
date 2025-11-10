import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';      // Make sure App.jsx is in the same src folder
import './index.css';         // Optional: include if you have index.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
