/**
 * PI² — Botão (design token driven).
 * Variantes: primary (vermelho), secondary (contorno), ghost (texto).
 * Use `fullWidth` para ocupar a largura toda (padrão dos protótipos).
 */
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null,
  iconAfter = null,
  className = '',
  type = 'button',
  disabled = false,
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {icon}
      {children && <span>{children}</span>}
      {iconAfter}
    </button>
  );
}
