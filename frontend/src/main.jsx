import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'; // 🌐 ADDED: Google Provider Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="676313052492-eu3gfdqhsc397iu8uarst8pindeu2qs3.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
)