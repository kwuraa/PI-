import React from 'react';
import './Button.css';

/**
 * Botão genérico.
 * variant: 'primary' (vermelho) | 'secondary' (contorno) | 'ghost' (texto)
 * fullWidth: ocupa 100% da largura do container
 */
export default function Button({
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const classes = [
    'button',
    `button--${variant}`,
    fullWidth && 'button--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
