import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './reactFN.js';   // <-- your main React file
import './index.css';            // optional, include if you have global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
