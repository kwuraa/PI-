/**
 * PI² — Abas em controle segmentado ("Painel unificado | Atalhos").
 * Props: items [{ id, label }], value, onChange.
 * O item ativo vira pílula branca sobre o trilho cinza (protótipos);
 * a pílula DESLIZA entre as abas via layoutId (framer-motion).
 * Obs.: usa um layoutId único — mantenha apenas UMA Tabs por tela.
 */
import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

export default function Tabs({ items, value, onChange, ariaLabel = 'Seções' }) {
  return (
    <div className={styles.track} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => onChange(item.id)}
          >
            {active && (
              <motion.span
                className={styles.pill}
                layoutId="tabsPill"
                transition={{ type: 'spring', stiffness: 500, damping: 42 }}
              />
            )}
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
