/**
 * PI² — Meus projetos do aluno (rota "/aluno").
 * -----------------------------------------------------------------------------
 * Protótipo "Meus projetos do aluno" (mockup 03 · desktop). Estrutura:
 *  1. hero — selo "Área do aluno", h1 "Minhas ideias em ação.", lead e
 *     botão "+ Novo projeto";
 *  2. estatísticas — Publicado / Em análise / Rascunho (contagem dinâmica);
 *  3. seção "Seus projetos" com o seletor "Todos (N)";
 *  4. grade de cartões — badge de status, título, meta do curso/período,
 *     linha do status (aprovação / envio / última edição) e ação principal
 *     (Ver projeto · Acompanhar análise · Continuar edição).
 *
 * O cartão é montado aqui (e não com <ProjectCard>) porque o protótipo usa
 * uma estrutura própria: sem descrição/tecnologias, com linha de status e
 * ação em rodapé. Mobile-first: 1 coluna; ≥1024px: 3 colunas.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowDown,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiEdit2,
  FiMoreHorizontal,
  FiPlus,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  COURSE_SHORT,
  MY_PROJECT_IDS,
  getProjectsByIds,
} from '../../mocks/projectsMock.js';
import styles from './MyProjectsPage.module.css';

/** Período letivo exibido nos protótipos desktop (mesmo valor do TopBar). */
const PERIOD = '2026.2';

/** Opções do seletor "Todos (N)" da seção "Seus projetos". */
const FILTERS = [
  { value: null, label: 'Todos' },
  { value: 'em-analise', label: 'Em análise' },
  { value: 'publicado', label: 'Publicados' },
];

/** Contagem de projetos por filtro (null = todos). */
function countFor(projects, value) {
  return value === null
    ? projects.length
    : projects.filter((project) => project.status === value).length;
}

/** Data curta do protótipo: "02 out. 2026" → "02 out." */
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

/** Ícone + cor + texto da linha de status do cartão (copy do mockup). */
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
        // Mockup: ícone de relógio cinza (neutro) na linha de status.
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
      // Rascunho do protótipo: rótulo fixo (mesma hora do "Rascunho salvo").
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* Fecha o menu "Todos (N)" ao clicar fora dele. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const visible =
    filter === null ? projects : projects.filter((p) => p.status === filter);
  const current = FILTERS.find((option) => option.value === filter) ?? FILTERS[0];

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------------- hero */}
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

      {/* --------------------------------------------- estatísticas */}
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

      {/* ------------------------------------ seção + seletor "Todos" */}
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

      {/* ----------------------------------------------------- grade */}
      <div className={styles.grid}>
        {visible.map((project) => {
          const action = actionFor(project);
          const status = statusMeta(project.status);
          const line = statusLineFor(project);
          return (
            <article key={project.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Badge tone={status.tone}>{status.label}</Badge>
                <button
                  type="button"
                  className={styles.cardMenu}
                  aria-label={`Mais opções de ${project.title}`}
                >
                  <FiMoreHorizontal aria-hidden="true" />
                </button>
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
