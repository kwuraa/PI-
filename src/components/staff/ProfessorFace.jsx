import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock } from 'react-icons/fi';

import Badge from '../ui/Badge/Badge.jsx';
import PageHeader from '../ui/PageHeader/PageHeader.jsx';
import StatCard from '../ui/StatCard/StatCard.jsx';
import { statusMeta } from '../../utils/status.js';
import {
  ADVISED_GROUP_IDS,
  PROJECTS,
  REVIEW_QUEUE_IDS,
  getProjectsByIds,
  getTeam,
} from '../../mocks/projectsMock.js';
import { METRICS } from './staffMetrics.js';
import shared from './StaffPanelShared.module.css';
import styles from './ProfessorFace.module.css';

export default function ProfessorFace({ user }) {
  const queue = getProjectsByIds(REVIEW_QUEUE_IDS);
  // ADVISED_GROUP_IDS guarda ids de EQUIPE (team-*), não de projeto — por isso
  // o filtro é em PROJECTS por `teamId` (getProjectsByIds devolveria []).
  const advised = PROJECTS.filter((project) =>
    ADVISED_GROUP_IDS.includes(project.teamId),
  );
  const who = user?.displayName ?? user?.name ?? '';

  /** Rola a página até a seção "Minhas orientações" (respeita reduced-motion). */
  const scrollToAdvised = () => {
    const target = document.getElementById('minhas-orientacoes');
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="primary">Área do professor</Badge>}
        gap="md"
        title={`Olá, ${who}. Vamos orientar ideias?`}
        lead="Seu olhar transforma projetos em conhecimento compartilhado."
      />

      {/* métricas viram botões (pedido): revisão → PRÓXIMO projeto da
          fila; orientações → rolagem até a seção "Minhas orientações" */}
      <div className={shared.stats}>
        {queue[0] ? (
          <Link to={`/painel/revisar/${queue[0].slug}`} className={styles.statLink}>
            <StatCard
              tone="primary"
              value={METRICS.reviewQueue}
              label="Aguardando revisão"
            />
          </Link>
        ) : (
          <StatCard
            tone="primary"
            value={METRICS.reviewQueue}
            label="Aguardando revisão"
          />
        )}
        <button type="button" className={styles.statLink} onClick={scrollToAdvised}>
          <StatCard value={METRICS.advised} label="Projetos sob orientação" />
        </button>
      </div>

      <div className={styles.split}>
        <section className={shared.block}>
          <h2 className={shared.blockTitle}>
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

        <section className={shared.block} id="minhas-orientacoes">
          <h2 className={shared.blockTitle}>Minhas orientações</h2>
          {/* card-resumo da PRIMEIRA orientação + "Ver todas" —
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
