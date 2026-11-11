/**
 * PI² — Callout / alerta em bloco (fundo suave + borda de estado).
 * tones: 'danger' (pendência, vermelho) | 'success' (aprovado) | 'neutral'.
 * Props: icon (nó JSX), title, children (texto), action (JSX — botão/link).
 */
import styles from './Callout.module.css';

export default function Callout({ tone = 'danger', icon = null, title, children, action = null }) {
  return (
    <section className={`${styles.callout} ${styles[tone]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {children && <div className={styles.text}>{children}</div>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </section>
  );
}
