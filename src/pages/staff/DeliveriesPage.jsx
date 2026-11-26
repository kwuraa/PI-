import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import PageHeader from '../../components/ui/PageHeader/PageHeader.jsx';
import SearchField from '../../components/ui/SearchField/SearchField.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import { statusMeta, statusOptions } from '../../utils/status.js';
import { COURSE_SHORT, PROJECTS, teamDisplay } from '../../mocks/projectsMock.js';
import styles from './DeliveriesPage.module.css';

/** Situações de entrega (valores EXATOS do mock: 'em-analise' | 'publicado'). */
const STATUS_FILTERS = statusOptions(['em-analise', 'publicado']);

export default function DeliveriesPage() {
  const [query, setQuery] = useState('');
  const [situation, setSituation] = useState(null);

  /** Contagens do topo — sempre sobre a lista completa (sem filtros). */
  const pendingCount = PROJECTS.filter((p) => p.status === 'em-analise').length;
  const publishedCount = PROJECTS.filter((p) => p.status === 'publicado').length;

  /** Lista filtrada por situação + busca (título ou nomes da equipe). */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesSituation = !situation || project.status === situation;
      const display = teamDisplay(project, { publicView: false });
      const haystack = [project.title, ...(display?.members ?? [])]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesSituation && matchesQuery;
    });
  }, [query, situation]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={<Badge tone="primary">Área do professor</Badge>}
        gap="md"
        titleLine="normal"
        title="Trabalhos enviados"
        lead="Acompanhe as entregas dos alunos e acesse os materiais de cada projeto."
      />

      <div className={styles.stats}>
        <StatCard tone="primary" value={pendingCount} label="Em análise" />
        <StatCard value={publishedCount} label="Publicado" />
      </div>

      <div className={styles.filters}>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Buscar projeto ou aluno"
        />
        <FilterChips
          options={STATUS_FILTERS}
          value={situation}
          onChange={setSituation}
          clearLabel="Todas"
        />
      </div>

      <SectionHeader title={`Entregas dos alunos · ${visible.length} projetos`} />

      <div className={styles.grid}>
        {visible.map((project) => {
          const meta = statusMeta(project.status);
          const display = teamDisplay(project, { publicView: false });
          return (
            <article key={project.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Badge tone={meta.tone}>{meta.label}</Badge>
                <FiClock className={styles.cardClock} aria-hidden="true" />
              </div>

              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardMeta}>
                {COURSE_SHORT} · Turma 2026.2 · Projeto integrador
              </p>
              <p className={styles.cardTeam}>{display?.primary}</p>
              <p className={styles.cardDate}>Enviado em {project.submittedAt}</p>

              <Link
                to={`/painel/entrega/${project.slug}`}
                className={styles.cardAction}
              >
                Ver entrega
                <FiArrowRight aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>
          Nenhuma entrega encontrada com esses filtros.
        </p>
      )}
    </div>
  );
}
