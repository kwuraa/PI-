/**
 * PI² — Ponto de entrada da aplicação.
 * Monta o React na div #root, carrega o CSS Reset + Design Tokens globais
 * e envolve tudo com o AuthProvider (autenticação simulada / RBAC).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import './styles/variables.css';
import './styles/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
