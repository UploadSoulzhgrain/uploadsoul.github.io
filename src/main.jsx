import React, { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './core/store'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import './styles/pet-style.css'
import './i18n/i18n.js' // Import i18n configuration

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
