import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/i18n.js' // Import i18n configuration
import apiKeyService from './services/apiKeyService.js' // Import API Key Service

// Initialize API keys from localStorage before rendering the app
apiKeyService.initialize();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)