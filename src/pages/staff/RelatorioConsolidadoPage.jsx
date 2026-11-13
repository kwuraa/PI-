/**
 * PI² — Relatório consolidado (rota "/painel/relatorio-consolidado").
 * -----------------------------------------------------------------------------
 * Uma única rota com DUAS faces (mesmo padrão do StaffPanelPage), escolhidas
 * pelo papel ativo:
 *  • só coordenador          → mockup 06 "Relatório consolidado": badge
 *    "Indicadores do semestre", seletor do semestre vigente, 4 StatCards
 *    (Grupos ativos · Alunos participantes · Média dos projetos · Entregas
 *    concluídas), card "Acompanpanhamento geral" com barras de progresso e
 *    card "Projetos no semestre · 4 projetos" + botão
 *    "Ver pendências dos grupos";
 *  • coordenador + professor → mockup 08 "Relatório consolidado — coorte":
 *    badge "Coordenador", seletor "Coorte · data de ingresso", 2 StatCards
 *    (Média geral · Pontos desde 2025.1), gráfico "Evolução por semestre",
 *    cards "Travas de disciplinas" e "Banca e entregáveis" e nota de
 *    consolidação.
 *
 * Fonte única: GROUPS em src/mocks/projectsMock.js (grupos ativos, alunos
 * participantes e grupos com documentação). Os demais números (média do
 * semestre, entregas recebidas, série da coorte, travas e bancas) são os
 * indicadores parciais do mockup — não existem nos mocks, por isso ficam
 * como constantes locais documentadas.
 * Observação de regra: as barras usam classes de largura/altura prontas no
 * CSS Module, porque o projeto proíbe estilo inline nos elementos JSX.
 */
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDownload, FiLock, FiPrinter } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { GROUPS } from '../../mocks/projectsMock.js';
import styles from './RelatorioConsolidadoPage.module.css';

/* ================================================== dados das faces */

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
  { id: 'publicado', label: 'Publicado', tone: 'success', value: 2 },
  { id: 'em-analise', label: 'Em análise', tone: 'warning', value: 1 },
  { id: 'rascunho', label: 'Rascunho', tone: 'neutral', value: 1 },
];

/** Total de projetos do card "Projetos no semestre · N projetos". */
const PROJECTS_TOTAL = PROJECT_STATUS_ROWS.reduce(
  (sum, row) => sum + row.value,
  0
);

/** Série do gráfico "Evolução por semestre" (mockup 08 — coorte). */
const COHORT_SERIES = [
  { id: '2025-1', label: '2025.1', value: '7,0', fill: 'h70' },
  { id: '2025-2', label: '2025.2', value: '7,5', fill: 'h75' },
  { id: '2026-1', label: '2026.1', value: '8,0', fill: 'h80' },
  { id: '2026-2', label: '2026.2', value: '8,5', fill: 'h85', highlight: true },
];

/** Disciplinas-chave que travam a progressão da coorte (mockup 08). */
const COHORT_LOCKS = [
  { id: 'bd', course: 'Banco de Dados', students: '2 alunos' },
  { id: 'es', course: 'Engenharia de Software', students: '1 aluno' },
];

/* ========================================================= cabeçalho */

/**
 * Cabeçalho padrão das duas faces: badge + h1 "Relatório consolidado" +
 * lead à esquerda e ações (exportar/imprimir) à direita no desktop.
 */
function ReportHeader({ badge, lead, actions }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTexts}>
        <Badge tone="primary">{badge}</Badge>
        <h1 className={styles.title}>Relatório consolidado</h1>
        <p className={styles.lead}>{lead}</p>
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

/* ============================================ face 06 (semestre) */

/** Face do coordenador: semestre vigente + acompanhamento + projetos. */
function SemesterReport() {
  return (
    <>
      <ReportHeader
        badge="Indicadores do semestre"
        lead="Uma visão geral dos projetos e do acompanhamento acadêmico."
        actions={
          <Button icon={<FiDownload aria-hidden="true" />}>
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

      <div className={`${styles.stats} ${styles.statsWide}`}>
        <StatCard tone="primary" value={METRICS.activeGroups} label="Grupos ativos" />
        <StatCard value={METRICS.students} label="Alunos participantes" />
        <StatCard value="8,2" label="Média dos projetos" />
        <StatCard value="75%" label="Entregas concluídas" />
      </div>

      <div className={styles.columns}>
        <Card padding="lg" className={styles.card}>
          <h2 className={styles.cardTitle}>Acompanpanhamento geral</h2>
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
                  <span className={`${styles.progressFill} ${styles[row.fill]}`} />
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.cardNote}>
            Indicadores parciais · Atualizado em 06 out. 2026
          </p>
        </Card>

        <div className={styles.sideColumn}>
          <Card padding="lg" className={styles.card}>
            <h2 className={styles.cardTitle}>
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

/* ============================================ face 08 (coorte) */

/** Face do coordenador + professor: coorte, evolução, travas e banca. */
function CohortReport() {
  return (
    <>
      <ReportHeader
        badge="Coordenador"
        lead="Uma visão da coorte, da evolução às pendências do curso."
        actions={
          <>
            <Button icon={<FiDownload aria-hidden="true" />}>Exportar PDF</Button>
            <Button variant="secondary" icon={<FiPrinter aria-hidden="true" />}>
              Imprimir
            </Button>
          </>
        }
      />

      <Card padding="lg" className={`${styles.card} ${styles.filterCard}`}>
        <div className={styles.filterField}>
          <Select label="Coorte · data de ingresso" defaultValue="2025-1">
            <option value="2025-1">1º semestre de 2025 · 10/02/2025</option>
            <option value="2025-2">2º semestre de 2025 · 11/07/2025</option>
          </Select>
        </div>
        <p className={styles.filterMeta}>ADS · 24 alunos · 4 grupos · Até 2026.2</p>
      </Card>

      <div className={styles.stats}>
        <StatCard tone="primary" value="7,75" label="Média geral" />
        <StatCard value="+1,5" label="Pontos desde 2025.1" />
      </div>

      <div className={styles.columns}>
        <Card padding="lg" className={styles.card}>
          <h2 className={styles.cardTitle}>Evolução por semestre</h2>
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

          <p className={styles.cardNote}>
            Média geral: (7,0 + 7,5 + 8,0 + 8,5) ÷ 4. Os quatro semestres têm o
            mesmo peso.
          </p>
        </Card>

        <div className={styles.sideColumn}>
          <Card padding="lg" className={styles.card}>
            <h2 className={styles.cardTitle}>Travas de disciplinas</h2>
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

          <Card padding="lg" className={styles.card}>
            <h2 className={styles.cardTitle}>Banca e entregáveis</h2>
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

/* ==================================================== rota principal */

/**
 * Rota "/painel/relatorio-consolidado" (exclusiva da coordenação).
 * O duplo papel (coordenador + professor) vê a face da coorte; o papel
 * apenas coordenador vê a face do semestre vigente — como nos mockups.
 */
export default function RelatorioConsolidadoPage() {
  const { isRole } = useAuth();
  return isRole('professor') ? <CohortReport /> : <SemesterReport />;
}
