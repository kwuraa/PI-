import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import styles from './ListRow.module.css';

export default function ListRow({
  icon = null,
  title,
  hint,
  badge = null,
  to,
  onClick,
  danger = false,
  plain = false,
  trailingIcon = null,
}) {
  const classes = [
    styles.row,
    to || onClick ? styles.interactive : '',
    plain ? styles.plain : '',
    danger ? styles.dangerTitle : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {!trailingIcon && icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
        {badge && <span className={styles.badgeSlot}>{badge}</span>}
      </span>
      {trailingIcon ? (
        <span className={styles.trailingIcon} aria-hidden="true">
          {trailingIcon}
        </span>
      ) : (
        <FiArrowRight className={styles.chevron} aria-hidden="true" />
      )}
    </>
  );

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
