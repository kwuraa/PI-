import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal } from '../../icons';
import './TopBar.css';

/**
 * Cabeçalho das telas públicas:
 * [voltar]      título      [ação]
 *
 * `onBack` — comportamento customizado; por padrão volta no histórico.
 * `action` — nó React do botão à direita; padrão = menu "···".
 */
export default function TopBar({
  title,
  onBack,
  action,
  showBack = true,
}) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header className="topbar">
      <div className="topbar__side">
        {showBack && (
          <button
            type="button"
            className="topbar__icon-button"
            onClick={handleBack}
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>
        )}
      </div>

      <h1 className="topbar__title">{title}</h1>

      <div className="topbar__side topbar__side--end">
        {action !== undefined ? (
          action
        ) : (
          <button
            type="button"
            className="topbar__icon-button topbar__icon-button--filled"
            aria-label="Mais opções"
          >
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
