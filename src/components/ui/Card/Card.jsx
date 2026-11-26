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
