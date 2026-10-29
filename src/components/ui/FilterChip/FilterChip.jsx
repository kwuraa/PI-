import React from 'react';
import './FilterChip.css';

/**
 * Chip de filtro (ex.: "Todos os cursos", "Arquitetura").
 * Controlada: a página define qual está ativa.
 */
export default function FilterChip({ active = false, onClick, children }) {
  return (
    <button
      type="button"
      className={['filter-chip', active && 'filter-chip--active']
        .filter(Boolean)
        .join(' ')}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
