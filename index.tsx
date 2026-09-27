import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { hydrateFromServer } from './services/syncService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Load the latest data from the server before first render (falls back to browser data if offline)
hydrateFromServer().finally(() => root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
));
