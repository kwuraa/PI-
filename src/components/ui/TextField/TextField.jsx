/**
 * PI² — Campo de texto com rótulo, ícone opcional à direita e texto de apoio.
 * Props: label, hint, icon (nó JSX à direita), locked (cadeado), required.
 * O input herda o estilo do módulo; nenhuma cor é fixada aqui (só tokens).
 * Ícones: react-icons/feather.
 */
import { FiLock } from 'react-icons/fi';
import styles from './TextField.module.css';

export default function TextField({
  label,
  hint,
  icon = null,
  locked = false,
  required = false,
  className = '',
  id,
  ...inputProps
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.control}>
        <input
          id={inputId}
          className={styles.input}
          required={required}
          readOnly={locked}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          {...inputProps}
        />
        {(icon || locked) && (
          <span className={styles.icon}>
            {locked ? <FiLock size={18} aria-hidden="true" /> : icon}
          </span>
        )}
      </div>
      {hint && (
        <p className={styles.hint} id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}
