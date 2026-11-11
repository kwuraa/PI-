/**
 * PI² — Histórico e Evolução do Grupo (rota "/painel/evolucao").
 * -----------------------------------------------------------------------------
 * Relatório QUALITATIVO (sem notas): linha do tempo por semestre com as
 * evidências anexadas + cards de evolução em critérios comportamentais.
 * Fonte única: GROUP_EVOLUTION em src/mocks/projectsMock.js.
 */
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiLock, FiTrendingUp } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { GROUP_EVOLUTION } from '../../mocks/projectsMock.js';
import styles from './EvolutionPage.module.css';

export default function EvolutionPage() {
  const report = GROUP_EVOLUTION;

  return (
    <div className={styles.page}>
      {/* ------------------------------------------ cabeçalho */}
      <Card padding="md" className={styles.head}>
        <Badge tone="primary">Relatório de evolução</Badge>
        <h1 className={styles.title}>{report.groupLabel}</h1>
        <p className={styles.meta}>{report.groupMeta}</p>
        <p className={styles.updated}>{report.updatedNote}</p>
      </Card>

      {/* ------------------------------------------ timeline */}
      <section className={styles.block}>
        <SectionHeader
          title="Histórico por semestre"
          subtitle="Marcos do grupo e respectivas evidências."
        />
        <ol className={styles.timeline}>
          {report.timeline.map((step) => (
            <li key={step.id} className={styles.step}>
              <span
                className={`${styles.stepIcon} ${step.locked ? styles.stepDone : styles.stepPending}`}
              >
                {step.locked ? (
                  <FiCheckCircle size={16} aria-hidden="true" />
                ) : (
                  <FiClock size={16} aria-hidden="true" />
                )}
              </span>
              <div className={styles.stepBody}>
                <span className={styles.stepTag}>{step.tag}</span>
                <strong className={styles.stepTitle}>{step.title}</strong>
                <p className={styles.stepSummary}>{step.summary}</p>
                <p className={styles.stepEvidence}>
                  <FiLock aria-hidden="true" />
                  {step.evidence}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* --------------------------------- evolução qualitativa */}
      <section className={styles.block}>
        <SectionHeader
          title="Evolução qualitativa"
          subtitle="O que melhorou ao longo do percurso — sem notas numéricas."
        />
        <div className={styles.qualitative}>
          {report.qualitative.map((item) => (
            <Card key={item.id} padding="md" className={styles.qualCard}>
              <span className={styles.qualIcon}>
                <FiTrendingUp aria-hidden="true" />
              </span>
              <div>
                <h3 className={styles.qualTitle}>{item.title}</h3>
                <p className={styles.qualSummary}>{item.summary}</p>
                <p className={styles.qualEvidence}>{item.evidence}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Link to="/painel" className={styles.back}>
        Voltar ao painel
      </Link>
    </div>
  );
}
