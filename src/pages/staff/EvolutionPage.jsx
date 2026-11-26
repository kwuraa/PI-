import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiLock } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import PageHeader from '../../components/ui/PageHeader/PageHeader.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import { GROUP_EVOLUTION } from '../../mocks/projectsMock.js';
import styles from './EvolutionPage.module.css';

export default function EvolutionPage() {
  const report = GROUP_EVOLUTION;

  return (
    <div className={styles.page}>
      <Link to="/painel" className={styles.backLink}>
        <FiArrowLeft aria-hidden="true" />
        Painel do professor
      </Link>

      <PageHeader
        gap="sm"
        titleLine="normal"
        className={styles.pageHeader}
        title="Evolução do grupo"
        lead="Acompanhe o histórico, marcos e entregas do grupo ao longo dos semestres."
      />

      <Card padding="md" className={styles.selector}>
        <Select label="Grupo selecionado" defaultValue={report.groupLabel}>
          <option value={report.groupLabel}>{report.groupLabel}</option>
        </Select>
        <p className={styles.groupMeta}>{report.groupMeta}</p>
        <p className={styles.updated}>{report.updatedNote}</p>
      </Card>

      <div className={styles.grid}>
        <section className={styles.column}>
          <SectionHeader title="Histórico por semestre" />
          <ol className={styles.timeline}>
            {report.timeline.map((step) => (
              <li key={step.id}>
                <Card padding="md" className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <Badge tone="primary">{step.tag}</Badge>
                    <FiLock className={styles.stepLock} aria-hidden="true" />
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepSummary}>{step.summary}</p>
                  <p className={styles.stepEvidence}>{step.evidence}</p>
                </Card>
              </li>
            ))}
          </ol>
          <div className={styles.exportRow}>
            <Button variant="secondary" icon={<FiDownload aria-hidden="true" />}>
              Exportar relatório
            </Button>
          </div>
        </section>

        <section className={styles.column}>
          <SectionHeader title="Evolução qualitativa" />
          <div className={styles.qualitative}>
            {report.qualitative.map((item) => (
              <Card key={item.id} padding="md" className={styles.qualCard}>
                <h3 className={styles.qualTitle}>{item.title}</h3>
                <p className={styles.qualSummary}>{item.summary}</p>
                <p className={styles.qualEvidence}>{item.evidence}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
