/**
 * PI² — Badge de status (pílula colorida).
 * tones: neutral | primary | success | warning | dark.
 * Ex.: <Badge tone="success">Publicado</Badge>
 */
import styles from './Badge.module.css';

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`${styles.badge} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}
