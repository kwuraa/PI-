/**
 * PI² — Linha de lista com ícone, título, selo opcional e seta.
 * Padrão das listas de atalhos, configurações e áreas de ação.
 * Props: icon, title, hint, badge (JSX — ex.: <Badge/>), to (link) | onClick.
 */
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import styles from './ListRow.module.css';

export default function ListRow({ icon = null, title, hint, badge = null, to, onClick }) {
  const inner = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
        {badge && <span className={styles.badgeSlot}>{badge}</span>}
      </span>
      <FiChevronRight className={styles.chevron} aria-hidden="true" />
    </>
  );

  const classes = `${styles.row} ${to || onClick ? styles.interactive : ''}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {inner}
    </button>
  );
}
