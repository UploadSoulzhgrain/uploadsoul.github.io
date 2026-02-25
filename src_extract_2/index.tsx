// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/i18n'; // Initialize i18n first
import App from './App';
import './index.css'; // Assuming you have a base CSS file or Tailwind setup

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);