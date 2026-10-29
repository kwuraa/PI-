import React from 'react';
import './PageShell.css';

/**
 * Casca das telas logadas: container centralizado com padding
 * que reserva o espaço da barra inferior fixa.
 */
export default function PageShell({ children }) {
  return <div className="page-shell">{children}</div>;
}
