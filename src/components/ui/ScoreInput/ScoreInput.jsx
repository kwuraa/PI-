import React from 'react';
import './ScoreInput.css';

/**
 * Campo de nota (0 a 10) no formato pt-BR ("8,0").
 * Controlado: a página guarda o valor como texto e calcula as médias.
 */
export default function ScoreInput({
  value,
  onChange,
  label,
  className = '',
  ...props
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      className={['score-input', className].filter(Boolean).join(' ')}
      value={value}
      aria-label={label}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    />
  );
}
