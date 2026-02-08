import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './core/store'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import './i18n/i18n.js' // Import i18n configuration

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ position: 'fixed', top: 0, left: 0, background: 'red', color: 'white', zIndex: 99999 }}>
      SYSTEM CHECK: main.jsx loaded
    </div>
    <Provider store={store}>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
