/**
 * PI² — Abas em controle segmentado ("Painel unificado | Atalhos").
 * Props: items [{ id, label }], value, onChange.
 * O item ativo vira pílula branca sobre o trilho cinza (protótipos).
 */
import styles from './Tabs.module.css';

export default function Tabs({ items, value, onChange, ariaLabel = 'Seções' }) {
  return (
    <div className={styles.track} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          className={`${styles.tab} ${value === item.id ? styles.active : ''}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
