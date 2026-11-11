/**
 * PI² — Campo de busca com ícone e ação opcional (filtros).
 * Props: value, onChange, placeholder, onFilterClick (abre o painel de filtros).
 * Controlado: o estado do texto vive na página que usa o componente.
 */
import { FiSearch, FiSliders } from 'react-icons/fi';
import styles from './SearchField.module.css';

export default function SearchField({
  value,
  onChange,
  placeholder = 'Buscar projetos…',
  onFilterClick,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.field}>
        <FiSearch className={styles.icon} aria-hidden="true" />
        <input
          type="search"
          className={styles.input}
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {onFilterClick && (
        <button
          type="button"
          className={styles.filterButton}
          onClick={onFilterClick}
          aria-label="Abrir filtros"
        >
          <FiSliders size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
