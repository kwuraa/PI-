import React, { useId } from 'react';
import './Checkbox.css';

/**
 * Caixa de seleção estilizada (checklist de critérios).
 * Controlada: a página guarda o estado de cada item.
 * O <input> nativo é preservado (teclado e leitores de tela).
 */
export default function Checkbox({ label, checked = false, onChange }) {
  const id = useId();

  return (
    <li className="checkbox">
      <input
        type="checkbox"
        id={id}
        className="checkbox__input"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <label htmlFor={id} className="checkbox__label">
        {label}
      </label>
    </li>
  );
}
