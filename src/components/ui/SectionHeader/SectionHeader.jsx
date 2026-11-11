/**
 * PI² — Cabeçalho de seção (título + subtítulo opcional + ação à direita).
 * Padrão das listas dos protótipos: "Aguardando revisão", "Notificações"…
 */
import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, subtitle, action = null }) {
  return (
    <div className={styles.header}>
      <div className={styles.texts}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
