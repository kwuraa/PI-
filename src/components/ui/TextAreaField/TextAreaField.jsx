import React, { useId } from 'react';
import './TextAreaField.css';

/**
 * Campo de várias linhas (ex.: parecer/feedback) com label e
 * texto de ajuda opcional. Controlado via value/onChange.
 */
export default function TextAreaField({
  label,
  helper,
  className = '',
  id,
  rows = 6,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const helperId = `${fieldId}-helper`;

  return (
    <div className={['textarea-field', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="textarea-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}

      <textarea
        id={fieldId}
        rows={rows}
        className="textarea-field__control"
        aria-describedby={helper ? helperId : undefined}
        {...props}
      />

      {helper && (
        <p id={helperId} className="textarea-field__helper">
          {helper}
        </p>
      )}
    </div>
  );
}
