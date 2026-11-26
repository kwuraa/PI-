import { motion } from 'framer-motion';
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
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {icon}
      {children && <span>{children}</span>}
      {iconAfter}
    </motion.button>
  );
}
