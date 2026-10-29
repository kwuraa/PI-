import React from 'react';
import './Logo.css';

/**
 * Logotipo do PI² — pilha de camadas em losango + wordmark.
 * `variant`:
 *  - 'stack'   → apenas o símbolo (headers e avatares)
 *  - 'stack-lg' → símbolo grande (tela de boas-vindas)
 *  - 'full'    → símbolo + texto "PI²" (cards)
 */
export default function Logo({ variant = 'stack', className = '' }) {
  const classes = ['logo', `logo--${variant}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes} role="img" aria-label="PI²">
      <svg
        className="logo__symbol"
        viewBox="0 0 120 128"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Camada inferior (cinza) */}
        <path
          className="logo__layer logo__layer--gray"
          d="M60 64 118 92 60 120 2 92Z"
        />
        {/* Camada média (vermelho translúcido) */}
        <path
          className="logo__layer logo__layer--soft"
          d="M60 44 118 72 60 100 2 72Z"
        />
        {/* Camada superior (vermelho vivo) */}
        <path
          className="logo__layer logo__layer--red"
          d="M60 20 118 48 60 76 2 48Z"
        />
        {/* Núcleo escuro (centro do funil) */}
        <ellipse className="logo__core" cx="60" cy="56" rx="14" ry="7" />
      </svg>
      {variant === 'full' && <span className="logo__word">PI²</span>}
    </span>
  );
}
