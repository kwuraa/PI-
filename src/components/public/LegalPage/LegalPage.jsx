import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import Button from '../../ui/Button/Button.jsx';
import styles from './LegalPage.module.css';

export default function LegalPage({
  icon,
  topTitle,
  title,
  subtitle,
  updated,
  sections = [],
  children = null,
  backTo = '/',
}) {
  const navigate = useNavigate();

  /** Voltar: usa o histórico quando existe, senão volta para a home. */
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(backTo);
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.back}
          onClick={handleBack}
          aria-label="Voltar"
        >
          <FiArrowLeft size={20} aria-hidden="true" />
        </button>
        <span className={styles.topTitle}>{topTitle}</span>
        <span className={styles.topSpacer} aria-hidden="true" />
      </header>

      <div className={styles.iconTile}>{icon}</div>

      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {updated && <p className={styles.updated}>Última atualização: {updated}</p>}
      </header>

      <div className={styles.body}>
        {sections.map((section) => (
          <section
            key={section.id}
            className={styles.section}
            aria-labelledby={section.id}
          >
            <h2 className={styles.sectionTitle} id={section.id}>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {children}
      </div>

      <Button variant="secondary" fullWidth onClick={handleBack}>
        Voltar
      </Button>
    </div>
  );
}
