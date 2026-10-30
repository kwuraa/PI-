import React from 'react';
import './FilterChip.css';

/**
 * Chip de filtro (ex.: "Todos os cursos", "Arquitetura").
 * Controlada: a página define qual está ativa.
 * `tone="primary"` força o tom vermelho (ex.: chips aplicados
 * no estado de resultados do Explorar).
 */
export default function FilterChip({ active = false, tone, onClick, children }) {
  const highlighted = active || tone === 'primary';

  return (
    <button
      type="button"
      className={['filter-chip', highlighted && 'filter-chip--active']
        .filter(Boolean)
        .join(' ')}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
