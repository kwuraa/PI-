/**
 * PI² — Histórico e Evolução do Grupo (rota "/painel/evolucao").
 * -----------------------------------------------------------------------------
 * Relatório QUALITATIVO (sem notas), em DUAS colunas no desktop (mockup
 * "Relatório Histórico e Evolução do Grupo") e empilhado no mobile:
 *  • topo — link "← Painel do professor", título "Evolução do grupo" e o
 *    lead do protótipo;
 *  • card "Grupo selecionado" — select do grupo + linha da sala/período +
 *    nota de atualização dos dados;
 *  • coluna esquerda — "Histórico por semestre": cards com selo do período,
 *    cadeado, marco, resumo e evidência, encerrados no botão
 *    "Exportar relatório";
 *  • coluna direita — "Evolução qualitativa": cards de critérios
 *    comportamentais (título, resumo e evidência).
 * Fonte única: GROUP_EVOLUTION em src/mocks/projectsMock.js.
 * Imagens/relatórios em PDF: FORA DE ESCOPO (item 16 adiado).
 */
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiLock } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import { GROUP_EVOLUTION } from '../../mocks/projectsMock.js';
import styles from './EvolutionPage.module.css';

export default function EvolutionPage() {
  const report = GROUP_EVOLUTION;

  return (
    <div className={styles.page}>
      {/* ------------------------------------------ topo */}
      <Link to="/painel" className={styles.backLink}>
        <FiArrowLeft aria-hidden="true" />
        Painel do professor
      </Link>

      <header className={styles.head}>
        <h1 className={styles.title}>Evolução do grupo</h1>
        <p className={styles.lead}>
          Acompanhe o histórico, marcos e entregas do grupo ao longo dos
          semestres.
        </p>
      </header>

      {/* --------------------------------- grupo selecionado */}
      <Card padding="md" className={styles.selector}>
        <Select label="Grupo selecionado" defaultValue={report.groupLabel}>
          <option value={report.groupLabel}>{report.groupLabel}</option>
        </Select>
        <p className={styles.groupMeta}>{report.groupMeta}</p>
        <p className={styles.updated}>{report.updatedNote}</p>
      </Card>

      {/* ---------------------- timeline + evolução (2 colunas) */}
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
