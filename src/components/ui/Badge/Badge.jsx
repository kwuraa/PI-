import styles from './Badge.module.css';

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}
