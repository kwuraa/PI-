/**
 * PI² — Callout / alerta em bloco (fundo suave + borda de estado).
 * tones: 'danger' (pendência, vermelho) | 'success' (aprovado) | 'neutral'.
 * Props: icon (nó JSX), title, children (texto), action (JSX — botão/link,
 * alinhado à direita; com `stacked` o action cai para baixo do texto,
 * como no card de alerta do painel do coordenador).
 */
import styles from './Callout.module.css';

export default function Callout({ tone = 'danger', icon = null, title, children, action = null, stacked = false }) {
  return (
    <section className={`${styles.callout} ${styles[tone]} ${stacked ? styles.stacked : ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {children && <div className={styles.text}>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}
