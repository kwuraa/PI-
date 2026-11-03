import React from 'react';
import './RadioOption.css';

/**
 * Opção de escolha única em cartão (ex.: visibilidade do projeto).
 * Preserva o input nativo (teclado/leitores de tela).
 */
export default function RadioOption({
  label,
  description,
  checked = false,
  onChange,
}) {
  return (
    <li
      className={['radio-option', checked && 'radio-option--checked']
        .filter(Boolean)
        .join(' ')}
    >
      <label className="radio-option__label">
        <input
          type="radio"
          className="radio-option__input"
          checked={checked}
          onChange={() => onChange?.()}
        />
        <span className="radio-option__text">
          <strong className="radio-option__title">{label}</strong>
          <span className="radio-option__description">{description}</span>
        </span>
      </label>
    </li>
  );
}
