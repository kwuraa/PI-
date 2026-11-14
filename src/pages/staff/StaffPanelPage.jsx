/**
 * PI² — Painel da equipe (rota "/painel").
 * -----------------------------------------------------------------------------
 * Um único ponto de entrada que escolhe a face conforme o espaço ativo:
 *  • só 'professor'   → Painel do professor (fila de revisão + orientações);
 *  • só 'coordenador' → Painel do coordenador (métricas + alerta + áreas);
 *  • os dois (unido)  → Painel unificado com abas "Painel unificado | Atalhos"
 *                       (a aba Atalhos tem h1 próprio, como no mockup 07).
 * Os números vêm dos mocks (fila de revisão, grupos, entregáveis) — nada fixo.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiClock,
  FiFileText,
  FiLink2,
  FiSliders,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import ListRow from '../../components/ui/ListRow/ListRow.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import Tabs from '../../components/ui/Tabs/Tabs.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ADVISED_GROUP_IDS,
  GROUPS,
  PROJECTS,
  REVIEW_QUEUE_IDS,
  getProjectsByIds,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './StaffPanel.module.css';

/** Métricas derivadas dos mocks (fonte única de verdade). */
const METRICS = {
  reviewQueue: REVIEW_QUEUE_IDS.length,
  advised: ADVISED_GROUP_IDS.length,
  activeGroups: GROUPS.length,
  pendingDeliveries: GROUPS.reduce((sum, g) => sum + g.pendingDeliveries, 0),
  pendingGroup: GROUPS.find((g) => g.pendingLabel && !g.docsUrl) ?? null,
};

const TABS = [
  { id: 'painel', label: 'Painel unificado' },
  { id: 'atalhos', label: 'Atalhos' },
];

/* ===================================================== faces do painel */

/** Painel do professor: fila de revisão + orientações (os atalhos que
 *  existiam aqui passaram para o grupo "Área acadêmica" da SideNav). */
function ProfessorFace({ user }) {
  const queue = getProjectsByIds(REVIEW_QUEUE_IDS);
  // ADVISED_GROUP_IDS guarda ids de EQUIPE (team-*), não de projeto — por isso
  // o filtro é em PROJECTS por `teamId` (getProjectsByIds devolveria []).
  const advised = PROJECTS.filter((project) =>
    ADVISED_GROUP_IDS.includes(project.teamId),
  );
  const who = user?.displayName ?? user?.name ?? '';
  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Área do professor</Badge>
        <h1 className={styles.greeting}>Olá, {who}. Vamos orientar ideias?</h1>
        <p className={styles.lead}>
          Seu olhar transforma projetos em conhecimento compartilhado.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard tone="primary" value={METRICS.reviewQueue} label="Aguardando revisão" />
        <StatCard value={METRICS.advised} label="Projetos sob orientação" />
      </div>

      <div className={styles.split}>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>
            Aguardando revisão · {queue.length} projetos
          </h2>
          <div className={`${styles.cardList} ${styles.cardListCols}`}>
            {queue.map((project) => {
              const status = statusMeta(project.status);
              const members = getTeam(project)?.members.join(' e ') ?? '';
              return (
                <article key={project.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <Badge tone={status.tone}>{status.label}</Badge>
                    <FiClock className={styles.reviewClock} aria-hidden="true" />
                  </div>
                  <h3 className={styles.reviewTitle}>{project.title}</h3>
                  <p className={styles.reviewTeam}>{members}</p>
                  <p className={styles.reviewMeta}>
                    Enviado em {project.submittedAt}
                  </p>
                  <Link
                    to={`/painel/revisar/${project.slug}`}
                    className={styles.reviewAction}
                  >
                    Revisar projeto
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Minhas orientações</h2>
          {/* mockup 04: card-resumo da PRIMEIRA orientação + "Ver todas" —
              a lista completa (3 projetos) fica em /painel/meu-projeto. */}
          {advised[0] ? (
            <div className={styles.advisedCard}>
              <strong className={styles.advisedTitle}>
                <Link to={`/projeto/${advised[0].slug}`}>{advised[0].title}</Link>
              </strong>
              <Badge tone={statusMeta(advised[0].status).tone}>
                {statusMeta(advised[0].status).label}
              </Badge>
              <span>
                {getTeam(advised[0])?.members.join(' e ') ?? ''}
                {advised[0].publishedAt
                  ? ` · Aprovado em ${advised[0].publishedAt}`
                  : ` · Enviado em ${advised[0].submittedAt}`}
              </span>
              <Link to="/painel/meu-projeto" className={styles.verTodas}>
                Ver todas ({advised.length})
              </Link>
            </div>
          ) : (
            <p className={styles.reviewMeta}>Nenhuma orientação no momento.</p>
          )}
        </section>
      </div>
    </>
  );
}

/** Painel do coordenador: métricas do curso + alerta + áreas de gestão. */
function CoordinatorFace() {
  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Área do coordenador</Badge>
        <h1 className={styles.greeting}>
          Olá, coordenador(a). Vamos acompanhar o PI?
        </h1>
        <p className={styles.lead}>
          Acompanhe os grupos DSM, suas entregas e a evolução ao longo dos
          semestres.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard tone="primary" value={METRICS.activeGroups} label="Grupos ativos" />
        <StatCard value={METRICS.pendingDeliveries} label="Entregáveis pendentes" />
      </div>

      {/* alerta + áreas em 2 colunas no desktop (mockup 06) */}
      <div className={styles.splitCoordinator}>
        {METRICS.pendingGroup && (
          <Callout
            stacked
            title="Grupo sem link de documentação"
            action={
              <Link to="/painel/grupos">
                <Button>Resolver</Button>
              </Link>
            }
          >
            {METRICS.pendingGroup.name} · {METRICS.pendingGroup.semesterLabel}
          </Callout>
        )}

        <section className={styles.sideCard}>
          <SectionHeader
            title="Áreas da coordenação"
            subtitle="Gerencie os grupos e acompanhe a evolução consolidada do DSM."
          />
          <div className={styles.rowsPlain}>
            <ListRow
              danger
              plain
              title="Relatório consolidado de evolução"
              to="/painel/relatorio-consolidado"
            />
            <ListRow danger plain title="Gestão de grupos" to="/painel/grupos" />
          </div>
        </section>
      </div>
    </>
  );
}

/** Face unificada (professor + coordenador) com abas. */
function UnifiedFace({ user }) {
  const [tab, setTab] = useState('painel');
  const who = user?.displayName ?? user?.name ?? '';
  /** "prof. Rafael" → "Prof. Rafael" (lead da aba Atalhos). */
  const whoCap = who.charAt(0).toUpperCase() + who.slice(1);

  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Espaço do professor e coordenador</Badge>
        {tab === 'atalhos' ? (
          <>
            <h1 className={styles.greeting}>Atalhos</h1>
            <p className={styles.lead}>
              {whoCap}, suas ações para orientar e coordenar, reunidas aqui.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.greeting}>
              Olá, {who}. Você orienta e coordena.
            </h1>
            <p className={styles.lead}>
              Suas orientações e a gestão do curso, no mesmo lugar.
            </p>
          </>
        )}
      </header>

      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === 'painel' ? (
        <>
          {/* seções professor/coordenador lado a lado (mockup 07) */}
          <div className={styles.splitTwo}>
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Como professor</h2>
              <div className={styles.stats}>
                <StatCard
                  tone="primary"
                  value={METRICS.reviewQueue}
                  label="Aguardando revisão"
                />
                <StatCard
                  value={METRICS.advised}
                  label="Projetos sob orientação"
                />
              </div>
            </section>

            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Como coordenador</h2>
              {/* card único com as 2 métricas em linhas inline (mockup 07) */}
              <div className={styles.combinedCard}>
                <div className={styles.combinedRow}>
                  <span className={styles.combinedLabel}>
                    {METRICS.activeGroups} Grupos ativos
                  </span>
                  <FiUsers className={styles.combinedIcon} aria-hidden="true" />
                </div>
                <div className={styles.combinedRow}>
                  <span className={styles.combinedLabel}>
                    {METRICS.pendingDeliveries} Entregáveis pendentes
                  </span>
                  <FiFileText
                    className={`${styles.combinedIcon} ${styles.combinedIconAlt}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </section>
          </div>

          {METRICS.pendingGroup && (
            <Callout
              icon={<FiLink2 size={22} aria-hidden="true" />}
              title="Grupo sem link de documentação"
              action={
                <Link to="/painel/grupos">
                  <Button icon={<FiArrowRight aria-hidden="true" />}>
                    Resolver
                  </Button>
                </Link>
              }
            >
              Confira o grupo e regularize o link para acompanhar as entregas.
            </Callout>
          )}
        </>
      ) : (
        <div className={styles.splitTwo}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Professor</h2>
            <div className={styles.rows}>
              <ListRow
                icon={<FiTrendingUp aria-hidden="true" />}
                title="Histórico e evolução do grupo"
                badge={<Badge tone="neutral">Professor</Badge>}
                to="/painel/evolucao"
              />
            </div>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Coordenador</h2>
            <div className={styles.rows}>
              <ListRow
                icon={<FiFileText aria-hidden="true" />}
                title="Relatório consolidado"
                badge={<Badge tone="neutral">Coordenador</Badge>}
                to="/painel/relatorio-consolidado"
              />
              <ListRow
                icon={<FiSliders aria-hidden="true" />}
                title="Gestão de grupos"
                badge={<Badge tone="neutral">Coordenador</Badge>}
                to="/painel/grupos"
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

/* ===================================================== rota principal */

export default function StaffPanelPage() {
  const { user, isRole } = useAuth();
  const isProfessor = isRole('professor');
  const isCoordinator = isRole('coordenador');

  if (isProfessor && isCoordinator) return <UnifiedFace user={user} />;
  if (isProfessor) return <ProfessorFace user={user} />;
  return <CoordinatorFace />;
}
