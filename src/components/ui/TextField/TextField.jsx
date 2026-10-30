import React, { useId } from 'react';
import './TextField.css';

/**
 * Campo de texto com label, ícone opcional à direita e estados de erro.
 * O componente é controlado: receba `value` e `onChange` da página.
 */
export default function TextField({
  label,
  icon,
  error,
  helper,
  className = '',
  id,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div className={['textfield', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="textfield__label" htmlFor={fieldId}>
          {label}
        </label>
      )}

      <div
        className={[
          'textfield__control',
          error && 'textfield__control--error',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          id={fieldId}
          className="textfield__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {icon && <span className="textfield__icon">{icon}</span>}
      </div>

      {helper && !error && (
        <p className="textfield__helper">{helper}</p>
      )}

      {error && (
        <p id={errorId} className="textfield__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
