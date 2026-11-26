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
