import React from 'react';
import { Check } from '../../icons';
import './ChoiceCard.css';

/**
 * Cartão de escolha (ex.: Aluno × Professor).
 * Comporta-se como radio-button estilizado.
 */
export default function ChoiceCard({
  icon,
  label,
  selected = false,
  onSelect,
  className = '',
}) {
  const classes = [
    'choice-card',
    selected && 'choice-card--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
    >
      <span className="choice-card__header">
        <span className="choice-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="choice-card__check" aria-hidden="true">
          {selected && <Check size={14} />}
        </span>
      </span>
      <span className="choice-card__label">{label}</span>
    </button>
  );
}
