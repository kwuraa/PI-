import React from 'react';
import './MiniStat.css';

/**
 * Cartão compacto de estatística (número + rótulo).
 * Usado no topo da área do aluno (Publicado / Em análise / Rascunho).
 */
export default function MiniStat({ value, label }) {
  return (
    <article className="mini-stat">
      <strong className="mini-stat__value">{value}</strong>
      <span className="mini-stat__label">{label}</span>
    </article>
  );
}
