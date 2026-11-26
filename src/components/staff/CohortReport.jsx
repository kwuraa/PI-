import { Link } from 'react-router-dom';
import { FiArrowRight, FiDownload, FiLock, FiPrinter } from 'react-icons/fi';

import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Card from '../ui/Card/Card.jsx';
import PageHeader from '../ui/PageHeader/PageHeader.jsx';
import Select from '../ui/Select/Select.jsx';
import StatCard from '../ui/StatCard/StatCard.jsx';
import { REPORT_TITLE, handlePrint } from './reportShared.js';
import shared from './ReportShared.module.css';
import styles from './CohortReport.module.css';

/** Série do gráfico "Evolução por semestre" (coorte). */
const COHORT_SERIES = [
  { id: '2025-1', label: '2025.1', value: '7,0', fill: 'h70' },
  { id: '2025-2', label: '2025.2', value: '7,5', fill: 'h75' },
  { id: '2026-1', label: '2026.1', value: '8,0', fill: 'h80' },
  { id: '2026-2', label: '2026.2', value: '8,5', fill: 'h85', highlight: true },
];

/** Disciplinas-chave que travam a progressão da coorte. */
const COHORT_LOCKS = [
  { id: 'bd', course: 'Banco de Dados', students: '2 alunos' },
  { id: 'es', course: 'Engenharia de Software', students: '1 aluno' },
];

export default function CohortReport() {
  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="primary">Coordenador</Badge>}
        gap="sm"
        actionsGap="lg"
        split="md"
        title={REPORT_TITLE}
        lead="Uma visão da coorte, da evolução às pendências do curso."
        actions={
          <>
            <Button icon={<FiDownload aria-hidden="true" />} onClick={handlePrint}>
              Exportar PDF
            </Button>
            <Button
              variant="secondary"
              icon={<FiPrinter aria-hidden="true" />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </>
        }
      />

      <Card padding="lg" className={`${shared.card} ${styles.filterCard}`}>
        <div className={styles.filterField}>
          <Select label="Coorte · data de ingresso" defaultValue="2025-1">
            <option value="2025-1">1º semestre de 2025 · 10/02/2025</option>
            <option value="2025-2">2º semestre de 2025 · 11/07/2025</option>
          </Select>
        </div>
        <p className={styles.filterMeta}>ADS · 24 alunos · 4 grupos · Até 2026.2</p>
      </Card>

      <div className={shared.stats}>
        <StatCard tone="primary" value="7,75" label="Média geral" />
        <StatCard value="+1,5" label="Pontos desde 2025.1" />
      </div>

      <div className={shared.columns}>
        <Card padding="lg" className={shared.card}>
          <h2 className={shared.cardTitle}>Evolução por semestre</h2>
          <p className={styles.cardSubtitle}>Média da coorte · escala de 0 a 10</p>

          <div className={styles.chartArea}>
            {COHORT_SERIES.map((item) => (
              <div key={item.id} className={styles.chartCol}>
                <strong className={styles.chartValue}>{item.value}</strong>
                <span
                  className={[
                    styles.chartBar,
                    styles[item.fill],
                    item.highlight ? styles.chartBarHighlight : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>
            ))}
          </div>
          <div className={styles.chartAxis}>
            {COHORT_SERIES.map((item) => (
              <span key={item.id} className={styles.chartTick}>
                {item.label}
              </span>
            ))}
          </div>

          <p className={shared.cardNote}>
            Média geral: (7,0 + 7,5 + 8,0 + 8,5) ÷ 4. Os quatro semestres têm o
            mesmo peso.
          </p>
        </Card>

        <div className={shared.sideColumn}>
          <Card padding="lg" className={shared.card}>
            <h2 className={shared.cardTitle}>Travas de disciplinas</h2>
            <div>
              <Badge tone="primary">CHAVE</Badge>
            </div>
            <p className={styles.cardText}>
              3 alunos com progressão bloqueada por disciplinas-chave.
            </p>
            <ul className={styles.lockList}>
              {COHORT_LOCKS.map((item) => (
                <li key={item.id} className={styles.lockRow}>
                  <span className={styles.lockTexts}>
                    <strong className={styles.lockName}>{item.course}</strong>
                    <span className={styles.lockCount}>{item.students}</span>
                  </span>
                  <FiLock className={styles.lockIcon} aria-hidden="true" />
                </li>
              ))}
            </ul>
            <Link to="/painel/grupos" className={styles.textLink}>
              Ver pendências da coorte
              <FiArrowRight aria-hidden="true" />
            </Link>
          </Card>

          <Card padding="lg" className={shared.card}>
            <h2 className={shared.cardTitle}>Banca e entregáveis</h2>
            <div className={styles.detailBlock}>
              <Badge tone="success">3 de 4 realizadas</Badge>
              <strong className={styles.detailLabel}>Banca</strong>
              <p className={styles.detailText}>
                1 banca agendada · 29 out. 2026
              </p>
            </div>
            <div className={styles.detailBlock}>
              <Badge tone="warning">2 pendentes</Badge>
              <strong className={styles.detailLabel}>Entregáveis</strong>
              <p className={styles.detailText}>
                10 de 12 recebidos · Faltam 1 relatório e 1 repositório de
                código.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <p className={styles.footnote}>Dados consolidados em 22 out. 2026</p>
    </>
  );
}
