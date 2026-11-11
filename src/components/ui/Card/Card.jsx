/**
 * PI² — Card de superfície (branco, borda suave, raio do token).
 * Base de quase todos os blocos dos protótipos: listas, painéis, detalhes.
 */
import styles from './Card.module.css';

export default function Card({
  as: Tag = 'div',
  padding = 'md',
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    styles.card,
    styles[`padding-${padding}`],
    interactive ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
