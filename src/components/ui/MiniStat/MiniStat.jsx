import React from 'react';
import './MiniStat.css';

/**
 * Cartão compacto de estatística (número + rótulo).
 * variant: 'default' (fundo claro) | 'primary' (fundo vermelho).
 */
export default function MiniStat({ value, label, variant = 'default' }) {
  return (
    <article className={`mini-stat mini-stat--${variant}`}>
      <strong className="mini-stat__value">{value}</strong>
      <span className="mini-stat__label">{label}</span>
    </article>
  );
}
