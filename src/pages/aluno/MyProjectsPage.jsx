import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowDown,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiEdit2,
  FiEye,
  FiHeart,
  FiMoreHorizontal,
  FiPlus,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import { statusMeta, statusOptions } from '../../utils/status.js';
import { useEngagement } from '../../context/EngagementContext.jsx';
import {
  COURSE_SHORT,
  MY_PROJECT_IDS,
  getProjectsByIds,
} from '../../mocks/projectsMock.js';
import { formatNumber } from '../../utils/format.js';
import useClickOutside from '../../hooks/useClickOutside.js';
import useCopyToClipboard from '../../hooks/useCopyToClipboard.js';
import styles from './MyProjectsPage.module.css';

/** Período letivo exibido no cabeçalho (mesmo valor do TopBar). */
const PERIOD = '2026.2';

/** Opções do seletor "Todos (N)" da seção "Seus projetos" (plural no mock). */
const FILTERS = [
  { value: null, label: 'Todos' },
  ...statusOptions(['em-analise', 'publicado'], {
    publicado: 'Publicados',
  }),
];

/** Contagem de projetos por filtro (null = todos). */
function countFor(projects, value) {
  return value === null
    ? projects.length
    : projects.filter((project) => project.status === value).length;
}

/** Data curta: "02 out. 2026" → "02 out." */
function shortDate(date) {
  return (date ?? '').replace(/ \d{4}$/, '');
}

/** Rótulo + destino da ação principal conforme o status. */
function actionFor(project) {
  if (project.status === 'em-analise') {
    return { label: 'Acompanhar análise', to: `/aluno/status/${project.slug}` };
  }
  if (project.status === 'publicado') {
    return { label: 'Ver projeto', to: `/projeto/${project.slug}` };
  }
  return { label: 'Continuar edição', to: '/aluno/novo' };
}

/** Ícone + cor + texto da linha de status do cartão. */
function statusLineFor(project) {
  switch (project.status) {
    case 'publicado':
      return {
        Icon: FiCheck,
        tone: styles.toneSuccess,
        text: `Aprovado em ${shortDate(project.publishedAt)} · ${project.saves} salvos`,
      };
    case 'em-analise':
      return {
        Icon: FiClock,
        // Ícone de relógio cinza (neutro) na linha de status.
        tone: styles.toneNeutral,
        text: `Enviado em ${shortDate(project.submittedAt)} · Aguardando orientador`,
      };
    case 'ajustes':
      return {
        Icon: FiEdit2,
        tone: styles.toneWarning,
        text: `Ajustes solicitados em ${shortDate(project.submittedAt)}`,
      };
    default:
      // Rascunho: rótulo fixo (mesma hora do "Rascunho salvo").
      return {
        Icon: FiEdit2,
        tone: styles.toneNeutral,
        text: 'Última edição hoje, às 09:38',
      };
  }
}

export default function MyProjectsPage() {
  // Relido a cada render (a rota /aluno remonta ao voltar do envio):
  // getProjectsByIds devolve os mesmos objetos do mock, então o status
  // gravado por updateProjectStatus já aparece aqui — badge, linha de
  // status e contadores Publicado / Em análise / Rascunho.
  const projects = getProjectsByIds(MY_PROJECT_IDS);
  const [filter, setFilter] = useState(null);
  /* Métricas públicas de cada projeto (views da sessão + curtidas). */
  const { viewsFor, likesFor } = useEngagement();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  /* Menu "..." do cartão: só um cartão com caixinha aberta por vez. */
  const [openCardId, setOpenCardId] = useState(null);
  const cardRef = useRef(null);
  /* Feedback do "Copiar link" (2s, enquanto a caixinha segue aberta). */
  const { copied: copiedSlug, copy } = useCopyToClipboard();

  /* Fecha os menus ("Todos (N)" e "..." do cartão) ao clicar fora. */
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);
  useClickOutside(cardRef, () => setOpenCardId(null), Boolean(openCardId));

  /** Copia o link público do projeto e mostra o feedback no item. */
  const handleCopyLink = (project) =>
    copy(`${window.location.origin}/projeto/${project.slug}`);

  const visible =
    filter === null ? projects : projects.filter((p) => p.status === filter);
  const current = FILTERS.find((option) => option.value === filter) ?? FILTERS[0];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTexts}>
          <Badge tone="primary">Área do aluno</Badge>
          <h1 className={styles.heroTitle}>Minhas ideias em ação.</h1>
          <p className={styles.heroLead}>
            Acompanhe cada etapa dos projetos que você está construindo.
          </p>
        </div>
        <Link to="/aluno/novo" className={styles.newButton}>
          <FiPlus aria-hidden="true" />
          Novo projeto
        </Link>
      </header>

      <div className={styles.stats}>
        <StatCard
          value={countFor(projects, 'publicado')}
          label={statusMeta('publicado').label}
        />
        <StatCard
          value={countFor(projects, 'em-analise')}
          label={statusMeta('em-analise').label}
        />
        <StatCard
          value={countFor(projects, 'rascunho')}
          label={statusMeta('rascunho').label}
        />
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Seus projetos</h2>
        <div className={styles.filterWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {current.label} ({countFor(projects, filter)})
            <FiArrowDown aria-hidden="true" />
          </button>
          {menuOpen && (
            <ul className={styles.filterMenu}>
              {FILTERS.map((option) => (
                <li key={option.label}>
                  <button
                    type="button"
                    className={
                      option.value === filter
                        ? styles.filterOptionActive
                        : styles.filterOption
                    }
                    onClick={() => {
                      setFilter(option.value);
                      setMenuOpen(false);
                    }}
                  >
                    {option.label} ({countFor(projects, option.value)})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {visible.map((project) => {
          const action = actionFor(project);
          const status = statusMeta(project.status);
          const line = statusLineFor(project);
          return (
            <article key={project.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Badge tone={status.tone}>{status.label}</Badge>
                <div
                  className={styles.cardMenuWrap}
                  ref={openCardId === project.id ? cardRef : undefined}
                >
                  <button
                    type="button"
                    className={styles.cardMenu}
                    aria-label={`Mais opções de ${project.title}`}
                    aria-haspopup="true"
                    aria-expanded={openCardId === project.id}
                    onClick={() =>
                      setOpenCardId((id) => (id === project.id ? null : project.id))
                    }
                  >
                    <FiMoreHorizontal aria-hidden="true" />
                  </button>
                  {openCardId === project.id && (
                    <ul className={styles.cardPop}>
                      <li>
                        <Link
                          to={action.to}
                          className={styles.cardPopItem}
                          onClick={() => setOpenCardId(null)}
                        >
                          {action.label}
                        </Link>
                      </li>
                      {/* "Ver projeto" separado quando a ação principal é outra
                          (ex.: "Continuar edição" leva a /aluno/novo) */}
                      {action.to !== `/projeto/${project.slug}` && (
                        <li>
                          <Link
                            to={`/projeto/${project.slug}`}
                            className={styles.cardPopItem}
                            onClick={() => setOpenCardId(null)}
                          >
                            Ver projeto
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          type="button"
                          className={styles.cardPopItem}
                          onClick={() => handleCopyLink(project)}
                        >
                          {copiedSlug === project.slug
                            ? 'Link copiado!'
                            : 'Copiar link'}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <h3 className={styles.cardTitle}>
                <Link to={`/projeto/${project.slug}`} className={styles.cardTitleLink}>
                  {project.title}
                </Link>
              </h3>

              <p className={styles.cardMeta}>
                {COURSE_SHORT} · {PERIOD}
              </p>

              <p className={styles.cardStatus}>
                <span className={line.tone}>
                  <line.Icon size={16} aria-hidden="true" />
                </span>
                {line.text}
              </p>

              <p className={styles.cardMetrics} aria-label="Visualizações e curtidas">
                <span>
                  <FiEye aria-hidden="true" />
                  {formatNumber(viewsFor(project.slug))}
                  <span>visualizações</span>
                </span>
                <span>
                  <FiHeart aria-hidden="true" />
                  {formatNumber(likesFor(project.slug))}
                  <span>curtidas</span>
                </span>
              </p>

              <div className={styles.cardFooter}>
                <Link to={action.to} className={styles.cardAction}>
                  {action.label}
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>
          Nenhum projeto neste filtro. Crie seu primeiro projeto integrador.
        </p>
      )}
    </div>
  );
}
