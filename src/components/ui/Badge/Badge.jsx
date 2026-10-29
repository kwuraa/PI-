import React from 'react';
import './Badge.css';

/**
 * Etiqueta/pílula de contexto (ex.: "Espaço do professor e coordenador").
 * tone: 'primary' (vermelho) | 'neutral' (cinza) | 'success' (verde) | 'amber' (âmbar).
 */
export default function Badge({ tone = 'primary', children, className = '' }) {
  const classes = ['badge', `badge--${tone}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}
