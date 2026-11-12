/**
 * PI² — Painel da equipe (rota "/painel").
 * -----------------------------------------------------------------------------
 * Um único ponto de entrada que escolhe a face conforme o espaço ativo:
 *  • só 'professor'   → Painel do professor (fila de revisão + orientações);
 *  • só 'coordenador' → Painel do coordenador (grupos + pendências);
 *  • os dois (unido)  → Painel unificado com abas "Painel unificado | Atalhos".
 * Os números vêm dos mocks (fila de revisão, grupos, entregáveis) — nada fixo.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiClipboard,
  FiFileText,
  FiFolder,
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

/** Painel do professor: fila de revisão + orientações + atalhos. */
function ProfessorFace({ user }) {
  const queue = getProjectsByIds(REVIEW_QUEUE_IDS);
  const advised = getProjectsByIds(ADVISED_GROUP_IDS);
  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Área do professor</Badge>
        <h1 className={styles.greeting}>
          Olá, {user.displayName ?? user.name}. Vamos transformar ideias em
          realidade?
        </h1>
        <p className={styles.lead}>
          Suas orientações e os próximos passos dos seus grupos, no mesmo lugar.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard
          tone="primary"
          value={METRICS.reviewQueue}
          label="Aguardando revisão"
          icon={<FiClipboard aria-hidden="true" />}
        />
        <StatCard
          value={METRICS.advised}
          label="Projetos sob orientação"
          icon={<FiUsers aria-hidden="true" />}
        />
      </div>

      {METRICS.pendingGroup && (
        <Callout
          icon={<FiFileText size={22} aria-hidden="true" />}
          title="Projeto sem link de documentação"
          action={
            <Link to={`/painel/entrega/${queue[0]?.slug ?? 'aquasense'}`}>
              <Button fullWidth>Resolver</Button>
            </Link>
          }
        >
          {METRICS.pendingGroup.name} · {METRICS.pendingGroup.semesterLabel}.{' '}
          {METRICS.pendingGroup.pendingHint}
        </Callout>
      )}

      <section className={styles.block}>
        <SectionHeader
          title="Aguardando revisão"
          action={<span className={styles.count}>{queue.length} projetos</span>}
        />
        <div className={styles.cardList}>
          {queue.map((project) => {
            const status = statusMeta(project.status);
            const members = getTeam(project)?.members.join(' e ') ?? '';
            return (
              <article key={project.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className={styles.reviewMeta}>
                    Enviado em {project.submittedAt}
                  </span>
                </div>
                <h3 className={styles.reviewTitle}>{project.title}</h3>
                <p className={styles.reviewTeam}>{members}</p>
                <Link to={`/painel/revisar/${project.slug}`} className={styles.reviewAction}>
                  Revisar projeto
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.block}>
        <SectionHeader
          title="Minhas orientações"
          action={<span className={styles.count}>{advised.length} projetos</span>}
        />
        <div className={styles.cardList}>
          {advised.map((project) => {
            const status = statusMeta(project.status);
            return (
              <Link
                key={project.id}
                to={`/projeto/${project.slug}`}
                className={styles.advisedCard}
              >
                <Badge tone={status.tone}>{status.label}</Badge>
                <strong>{project.title}</strong>
                <span>
                  {project.publishedAt
                    ? `Aprovado em ${project.publishedAt}`
                    : `Enviado em ${project.submittedAt}`}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.block}>
        <SectionHeader title="Atalhos" />
        <div className={styles.rows}>
          <ListRow
            icon={<FiTrendingUp aria-hidden="true" />}
            title="Histórico e evolução do grupo"
            hint="Timeline qualitativa por semestre"
            to="/painel/evolucao"
          />
          <ListRow
            icon={<FiClipboard aria-hidden="true" />}
            title="Meu projeto e materiais"
            hint="Arquivos e links de apoio das orientações"
            to="/painel/meu-projeto"
          />
          <ListRow
            icon={<FiFolder aria-hidden="true" />}
            title="Trabalhos enviados"
            hint="Entregas dos alunos para acompanhar"
            to="/painel/entregas"
          />
        </div>
      </section>
    </>
  );
}

/** Painel do coordenador: métricas do curso + áreas de gestão. */
function CoordinatorFace({ user }) {
  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Área do coordenador</Badge>
        <h1 className={styles.greeting}>
          Olá, {user.displayName ?? user.name}. Vamos acompanhar o PI?
        </h1>
        <p className={styles.lead}>
          Acompanhe os grupos DSM, suas entregas e a evolução ao longo dos
          semestres.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard
          tone="primary"
          value={METRICS.activeGroups}
          label="Grupos ativos"
          icon={<FiUsers aria-hidden="true" />}
        />
        <StatCard
          value={METRICS.pendingDeliveries}
          label="Entregáveis pendentes"
          icon={<FiClipboard aria-hidden="true" />}
        />
      </div>

      {METRICS.pendingGroup && (
        <Callout
          icon={<FiFileText size={22} aria-hidden="true" />}
          title="Grupo sem link de documentação"
          action={
            <Link to="/painel/grupos">
              <Button fullWidth>Resolver</Button>
            </Link>
          }
        >
          {METRICS.pendingGroup.name} · {METRICS.pendingGroup.semesterLabel}.{' '}
          {METRICS.pendingGroup.pendingHint}
        </Callout>
      )}

      <section className={styles.block}>
        <SectionHeader title="Áreas da coordenação" />
        <div className={styles.rows}>
          <ListRow
            icon={<FiUsers aria-hidden="true" />}
            title="Gestão de grupos"
            hint="Pendências, documentação e evolução por grupo"
            badge={<Badge tone="neutral">Coordenador</Badge>}
            to="/painel/grupos"
          />
          <ListRow
            icon={<FiTrendingUp aria-hidden="true" />}
            title="Relatório consolidado de evolução"
            hint="Histórico qualitativo dos grupos do DSM"
            badge={<Badge tone="neutral">Coordenador</Badge>}
            to="/painel/evolucao"
          />
        </div>
      </section>
    </>
  );
}

/** Face unificada (professor + coordenador) com abas. */
function UnifiedFace({ user }) {
  const [tab, setTab] = useState('painel');

  return (
    <>
      <header className={styles.header}>
        <Badge tone="primary">Espaço do professor e coordenador</Badge>
        <h1 className={styles.greeting}>
          Olá, {user.displayName ?? user.name}. Você orienta e coordena.
        </h1>
        <p className={styles.lead}>
          Suas orientações e a gestão do curso, no mesmo lugar.
        </p>
      </header>

      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === 'painel' ? (
        <>
          <section className={styles.block}>
            <SectionHeader title="Como professor" />
            <div className={styles.stats}>
              <StatCard
                tone="primary"
                value={METRICS.reviewQueue}
                label="Aguardando revisão"
                icon={<FiClipboard aria-hidden="true" />}
              />
              <StatCard
                value={METRICS.advised}
                label="Projetos sob orientação"
                icon={<FiUsers aria-hidden="true" />}
              />
            </div>
          </section>

          <section className={styles.block}>
            <SectionHeader title="Como coordenador" />
            <div className={styles.stats}>
              <StatCard
                value={METRICS.activeGroups}
                label="Grupos ativos"
                icon={<FiUsers aria-hidden="true" />}
              />
              <StatCard
                value={METRICS.pendingDeliveries}
                label="Entregáveis pendentes"
                icon={<FiFileText aria-hidden="true" />}
              />
            </div>
          </section>

          {METRICS.pendingGroup && (
            <Callout
              icon={<FiFileText size={22} aria-hidden="true" />}
              title="Grupo sem link de documentação"
              action={
                <Link to="/painel/grupos">
                  <Button fullWidth>Resolver</Button>
                </Link>
              }
            >
              {METRICS.pendingGroup.name} · {METRICS.pendingGroup.semesterLabel}.{' '}
              {METRICS.pendingGroup.pendingHint}
            </Callout>
          )}
        </>
      ) : (
        <>
          <section className={styles.block}>
            <SectionHeader title="Professor" />
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
            <SectionHeader title="Coordenador" />
            <div className={styles.rows}>
              <ListRow
                icon={<FiSliders aria-hidden="true" />}
                title="Gestão de grupos"
                badge={<Badge tone="neutral">Coordenador</Badge>}
                to="/painel/grupos"
              />
            </div>
          </section>
        </>
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
  return <CoordinatorFace user={user} />;
}
