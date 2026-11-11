/**
 * PI² — Chips de filtro (semestre, tecnologia, status…).
 * Props: options [{ value, label }], value (id ativo | null),
 *        onChange(value), multiple (modo conjunto), clearLabel.
 * No modo múltiplo, value é um array; o chip "Todos" limpa a seleção.
 * Micro-interação: o chip afina levemente no toque (framer-motion whileTap).
 */
import { motion } from 'framer-motion';
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
        <motion.button
          type="button"
          className={`${styles.chip} ${
            (multiple ? value.length === 0 : value === null) ? styles.active : ''
          }`}
          onClick={() => handleClick(null)}
          whileTap={{ scale: 0.95 }}
        >
          {clearLabel}
        </motion.button>
      )}
      {options.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          className={`${styles.chip} ${isActive(option.value) ? styles.active : ''}`}
          onClick={() => handleClick(option.value)}
          whileTap={{ scale: 0.95 }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}
