/**
 * PI² — Select nativo estilizado (chevron próprio via CSS).
 * Uso: <Select label="Período" options={[{value,label}]} … />
 * Ícone de chevron: react-icons/feather.
 */
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.css';

export default function Select({
  label,
  hint,
  required = false,
  className = '',
  id,
  children,
  ...rest
}) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.control}>
        <select id={selectId} className={styles.select} required={required} {...rest}>
          {children}
        </select>
        <FiChevronDown className={styles.chevron} aria-hidden="true" />
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
