/**
 * PI² — Linha de lista com ícone, título, selo opcional e seta vermelha.
 * Padrão das listas de atalhos, configurações e áreas de ação.
 * Props: icon, title, hint, badge (JSX — ex.: <Badge/>), to (link) | onClick,
 * danger (título em vermelho, linhas da coordenação),
 * plain (sem borda própria + divisor, para uso dentro de um card).
 * Variante ADITIVA (não altera o comportamento padrão das demais telas):
 *  • trailingIcon (JSX) — ícone simples à DIREITA, sem chevron e sem chip
 *    à esquerda, como as linhas de "Conta e privacidade" do mockup 02
 *    (perfil). Quando presente, o prop `icon` (esquerda) é ignorado e a
 *    seta vermelha não é renderizada; `danger`/`plain` continuam valendo.
 */
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
