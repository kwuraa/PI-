/**
 * PI² — Face do COORDENADOR do relatório consolidado: semestre vigente
 * (mockup 06 "Relatório consolidado").
 * -----------------------------------------------------------------------------
 * Extraído de RelatorioConsolidadoPage.jsx na separação "um componente por
 * arquivo" (item 6), junto com as classes de RelatorioConsolidadoPage.module.css
 * que só ela usa.
 *
 * Conteúdo: seletor do semestre vigente, 4 StatCards (Grupos ativos ·
 * Alunos participantes · Média dos projetos · Entregas concluídas), card
 * "Acompanpanhamento geral" com barras de progresso e card "Projetos no
 * semestre" + botão "Ver pendências dos grupos".
 *
 * Fonte única: GROUPS em src/mocks/projectsMock.js. Os demais números são os
 * indicadores parciais do mockup — não existem nos mocks, por isso ficam como
 * constantes locais documentadas. As barras usam classes de largura prontas no
 * CSS Module, porque o projeto proíbe estilo inline nos elementos JSX.
 *
 * Usa as classes compartilhadas de ReportShared.module.css — importe-o ANTES
 * deste módulo.
 *
 * Uso (dentro da RelatorioConsolidadoPage):
 *   <SemesterReport />
 */
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';

import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Card from '../ui/Card/Card.jsx';
import PageHeader from '../ui/PageHeader/PageHeader.jsx';
import Select from '../ui/Select/Select.jsx';
import StatCard from '../ui/StatCard/StatCard.jsx';
import { GROUPS } from '../../mocks/projectsMock.js';
import { statusMeta } from '../../utils/status.js';
import { REPORT_TITLE, handlePrint } from './reportShared.js';
import shared from './ReportShared.module.css';
import styles from './SemesterReport.module.css';

/** Alunos de um grupo: nomes avulsos + sufixo "+ 2 alunos" do mock. */
const studentsOf = (group) =>
  group.members.reduce((total, member) => {
    const extra = member.match(/^\+\s*(\d+)/);
    return total + (extra ? Number(extra[1]) : 1);
  }, 0);

/** Métricas derivadas de GROUPS (fonte única de verdade do relatório). */
const METRICS = {
  activeGroups: GROUPS.length,
  students: GROUPS.reduce((total, group) => total + studentsOf(group), 0),
  groupsWithDocs: GROUPS.filter((group) => group.docsUrl).length,
};

/**
 * Linhas do card "Acompanpanhamento geral" (mockup 06).
 * `fill` aponta a classe de largura da barra — não há cálculo em linha,
 * pois o estilo inline nos elementos JSX é proibido no projeto.
 */
const PROGRESS_ROWS = [
  {
    id: 'entregaveis',
    label: 'Entregáveis recebidos',
    done: 6,
    total: 8,
    fill: 'fill75',
  },
  {
    id: 'documentacao',
    label: 'Grupos com documentação',
    done: METRICS.groupsWithDocs,
    total: METRICS.activeGroups,
    fill: 'fill75',
  },
  {
    id: 'docentes',
    label: 'Docentes avaliados',
    done: 1,
    total: 3,
    fill: 'fill33',
  },
];

/** Contagem de projetos por status no semestre (mockup 06). */
const PROJECT_STATUS_ROWS = [
  { id: 'publicado', value: 2 },
  { id: 'em-analise', value: 1 },
  { id: 'rascunho', value: 1 },
].map((row) => ({ ...row, ...statusMeta(row.id) }));

/** Total de projetos do card "Projetos no semestre · N projetos". */
const PROJECTS_TOTAL = PROJECT_STATUS_ROWS.reduce(
  (sum, row) => sum + row.value,
  0
);

export default function SemesterReport() {
  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="primary">Indicadores do semestre</Badge>}
        gap="sm"
        actionsGap="lg"
        split="md"
        title={REPORT_TITLE}
        lead="Uma visão geral dos projetos e do acompanhamento acadêmico."
        actions={
          <Button icon={<FiDownload aria-hidden="true" />} onClick={handlePrint}>
            Exportar relatório em PDF
          </Button>
        }
      />

      <div className={styles.controls}>
        <Select
          label="Semestre vigente"
          defaultValue="2026-2"
          className={styles.semesterField}
        >
          <option value="2026-2">2026.2 · 2º semestre</option>
          <option value="2026-1">2026.1 · 1º semestre</option>
        </Select>
      </div>

      <div className={`${shared.stats} ${styles.statsWide}`}>
        <StatCard tone="primary" value={METRICS.activeGroups} label="Grupos ativos" />
        <StatCard value={METRICS.students} label="Alunos participantes" />
        <StatCard value="8,2" label="Média dos projetos" />
        <StatCard value="75%" label="Entregas concluídas" />
      </div>

      <div className={shared.columns}>
        <Card padding="lg" className={shared.card}>
          <h2 className={shared.cardTitle}>Acompanpanhamento geral</h2>
          <ul className={styles.progressList}>
            {PROGRESS_ROWS.map((row) => (
              <li key={row.id} className={styles.progressRow}>
                <div className={styles.progressTop}>
                  <span className={styles.progressLabel}>{row.label}</span>
                  <strong className={styles.progressValue}>
                    {row.done} de {row.total}
                  </strong>
                </div>
                <span className={styles.progressTrack}>
                  <span
                    className={`${styles.progressFill} ${styles[row.fill]}`}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className={shared.cardNote}>
            Indicadores parciais · Atualizado em 06 out. 2026
          </p>
        </Card>

        <div className={shared.sideColumn}>
          <Card padding="lg" className={shared.card}>
            <h2 className={shared.cardTitle}>
              Projetos no semestre · {PROJECTS_TOTAL} projetos
            </h2>
            <ul className={styles.countList}>
              {PROJECT_STATUS_ROWS.map((row) => (
                <li key={row.id} className={styles.countRow}>
                  <Badge tone={row.tone}>{row.label}</Badge>
                  <strong className={styles.countValue}>{row.value}</strong>
                </li>
              ))}
            </ul>
            <div className={styles.cardAction}>
              <Link to="/painel/grupos">
                <Button variant="secondary">Ver pendências dos grupos</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
