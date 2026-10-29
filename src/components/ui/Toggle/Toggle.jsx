import React from 'react';
import './Toggle.css';

/**
 * Chave (switch) para preferências ligar/desligar.
 * Controlada: a página guarda o estado (`checked`) de cada opção.
 * Acessibilidade: usa role="switch" + aria-checked.
 */
export default function Toggle({ checked = false, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={['toggle', checked && 'toggle--on'].filter(Boolean).join(' ')}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  );
}
