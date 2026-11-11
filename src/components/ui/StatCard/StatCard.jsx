/**
 * PI² — Cartão de estatística (número grande + rótulo + ícone).
 * tone: 'primary' (fundo vermelho, destaque dos protótipos) | 'plain'.
 * Usado nos painéis (2 aguardando revisão · 4 grupos ativos…).
 */
import styles from './StatCard.module.css';

export default function StatCard({ value, label, icon = null, tone = 'plain', as: Tag = 'div' }) {
  return (
    <Tag className={`${styles.card} ${styles[tone]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <strong className={styles.value}>{value}</strong>
      <span className={styles.label}>{label}</span>
    </Tag>
  );
}
