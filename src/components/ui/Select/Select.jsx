import React, { useId } from 'react';
import { ChevronDown } from '../../icons';
import './Select.css';

/**
 * Campo de seleção (menu nativo) com label e chevron.
 * `options`: array de strings — o valor de cada opção é o próprio texto.
 * Controlado via value/onChange.
 */
export default function Select({
  label,
  options = [],
  className = '',
  id,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div className={['select', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="select__label" htmlFor={fieldId}>
          {label}
        </label>
      )}

      <div className="select__control">
        <select id={fieldId} className="select__input" {...props}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="select__chevron" aria-hidden="true">
          <ChevronDown size={20} />
        </span>
      </div>
    </div>
  );
}
