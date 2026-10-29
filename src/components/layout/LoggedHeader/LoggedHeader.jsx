import React from 'react';
import Logo from '../../ui/Logo/Logo';
import './LoggedHeader.css';

/**
 * Cabeçalho das telas logadas:
 * [logo]   CONTEXTO (uppercase)   [avatar]
 */
export default function LoggedHeader({ context, user }) {
  return (
    <header className="logged-header">
      <span className="logged-header__logo" aria-hidden="true">
        <Logo variant="full" />
      </span>

      <p className="logged-header__context">{context}</p>

      <span className="logged-header__avatar" aria-label={`Perfil de ${user.name}`}>
        {user.initials}
      </span>
    </header>
  );
}
