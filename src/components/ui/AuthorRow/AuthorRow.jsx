import React from 'react';
import './AuthorRow.css';

/**
 * Linha de participante do projeto (autor/orientador).
 * Estrutura: [iniciais] [nome] · [papel]
 * tone: 'neutral' (cinza) | 'primary' (destaque vermelho p/ orientador)
 */
export default function AuthorRow({ author }) {
  const { initials, name, role, tone = 'neutral' } = author;

  return (
    <li className={['author-row', `author-row--${tone}`].join(' ')}>
      <span className="author-row__avatar" aria-hidden="true">
        {initials}
      </span>

      <span className="author-row__text">
        <strong className="author-row__name">{name}</strong>
        <span className="author-row__role">{role}</span>
      </span>
    </li>
  );
}
