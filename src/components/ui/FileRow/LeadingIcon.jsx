import { FiFileText } from 'react-icons/fi';

import styles from './LeadingIcon.module.css';

export default function LeadingIcon({ variant, size }) {
  const props = { 'aria-hidden': 'true', ...(size ? { size } : {}) };

  if (variant === 'circle') {
    return (
      <span className={styles.iconCircle}>
        <FiFileText {...props} />
      </span>
    );
  }
  if (variant === 'square' || variant === 'square-sm') {
    return (
      <span
        className={variant === 'square' ? styles.iconSquare : styles.iconSquareSm}
      >
        <FiFileText {...props} />
      </span>
    );
  }
  return <FiFileText className={styles.iconPlain} {...props} />;
}
