/**
 * PI² — Avatar com iniciais (círculo).
 * tones: 'neutral' (cinza) | 'primary' (vermelho suave).
 * Usado em listas de equipe, watchers e comentários.
 */
import styles from './Avatar.module.css';

export default function Avatar({ initials = '—', tone = 'neutral', size = 'md' }) {
  return (
    <span
      className={`${styles.avatar} ${styles[tone]} ${styles[size]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
