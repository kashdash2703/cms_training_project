import React from 'react'; 
import ReactDOM from 'react-dom/client'; // Imports the React tool that can place React components into the real browser page.
import './style.css';
import { App } from './app'; // Imports the main app component from `app.tsx`.

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
