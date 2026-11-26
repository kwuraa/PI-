import styles from './RouteFallback.module.css';

export default function RouteFallback() {
  return (
    <p className={styles.fallback} role="status" aria-live="polite">
      Carregando…
    </p>
  );
}
