import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { EngagementProvider } from './context/EngagementContext.jsx';

import './styles/variables.css';
import './styles/reset.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EngagementProvider>
          <App />
        </EngagementProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
