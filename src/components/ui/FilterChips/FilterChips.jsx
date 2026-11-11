/**
 * PI² — Chips de filtro (semestre, tecnologia, status…).
 * Props: options [{ value, label }], value (id ativo | null),
 *        onChange(value), multiple (modo conjunto), clearLabel.
 * No modo múltiplo, value é um array; o chip "Todos" limpa a seleção.
 */
import styles from './FilterChips.module.css';

function toggle(list, item) {
  return list.includes(item) ? list.filter((v) => v !== item) : [...list, item];
}

export default function FilterChips({
  options,
  value,
  onChange,
  multiple = false,
  clearLabel = 'Todos',
}) {
  const isActive = (optionValue) =>
    multiple ? value.includes(optionValue) : value === optionValue;

  const handleClick = (optionValue) => {
    if (!multiple) {
      onChange(value === optionValue ? null : optionValue);
      return;
    }
    onChange(optionValue === null ? [] : toggle(value, optionValue));
  };

  return (
    <div className={styles.chips} role="group">
      {clearLabel !== null && clearLabel !== undefined && (
        <button
          type="button"
          className={`${styles.chip} ${
            (multiple ? value.length === 0 : value === null) ? styles.active : ''
          }`}
          onClick={() => handleClick(null)}
        >
          {clearLabel}
        </button>
      )}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.chip} ${isActive(option.value) ? styles.active : ''}`}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
