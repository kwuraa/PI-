import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import MiniStat from '../../components/ui/MiniStat/MiniStat';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterChip from '../../components/ui/FilterChip/FilterChip';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import { ArrowRight, Clock, CheckCircle2 } from '../../components/icons';
import { submissionsService } from '../../services/submissionsService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './ProfessorSubmissionsPage.css';

const STATUS = {
  'in-review': { label: 'Em análise', tone: 'amber', icon: Clock },
  published: { label: 'Publicado', tone: 'success', icon: CheckCircle2 },
};

/**
 * Tela "Trabalhos enviados" (/professor/entregas).
 * Lista as entregas dos alunos com busca e filtros.
 */
export default function ProfessorSubmissionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await submissionsService.getSubmissions();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar as entregas.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  /** Filtra por texto (título/autor) e pela turma selecionada. */
  const visible = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();

    return data.submissions.filter((submission) => {
      const matchesText =
        !term ||
        submission.title.toLowerCase().includes(term) ||
        submission.authors.toLowerCase().includes(term);
      const matchesClass =
        !classFilter || submission.classLine.includes('2026.2');
      return matchesText && matchesClass;
    });
  }, [data, query, classFilter]);

  if (loading) {
    return (
      <PageShell>
        <p className="submissions__status" role="status">
          Carregando entregas…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="submissions__status submissions__status--error" role="alert">
          {error || 'Não foi possível carregar as entregas.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, stats, filters, section } = data;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="submissions__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="submissions__headline">{header.headline}</h1>
          <p className="submissions__description">{header.description}</p>
        </section>

        <div className="submissions__stats">
          {stats.map((stat) => (
            <MiniStat
              key={stat.id}
              value={stat.value}
              label={stat.label}
              variant={stat.variant}
            />
          ))}
        </div>

        <SearchBar
          placeholder={data.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          showFilter={false}
        />

        <div className="submissions__filters">
          <FilterChip active={!classFilter} onClick={() => setClassFilter(false)}>
            {filters.allLabel}
          </FilterChip>
          <FilterChip active={classFilter} onClick={() => setClassFilter(true)}>
            {filters.classLabel}
          </FilterChip>
        </div>

        <section className="submissions__section">
          <SectionHeader title={section.title} actionLabel={section.actionLabel} />

          <div className="submissions__list">
            {visible.map((submission) => {
              const status = STATUS[submission.status];
              const StatusIcon = status.icon;

              return (
                <article className="submission-card" key={submission.id}>
                  <header className="submission-card__header">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    <span
                      className={`submission-card__icon submission-card__icon--${status.tone}`}
                      aria-hidden="true"
                    >
                      <StatusIcon size={20} />
                    </span>
                  </header>

                  <h3 className="submission-card__title">{submission.title}</h3>
                  <strong className="submission-card__authors">
                    {submission.authors}
                  </strong>

                  <p className="submission-card__meta">{submission.course}</p>
                  <p className="submission-card__meta">{submission.classLine}</p>
                  <p className="submission-card__meta">{submission.dateLine}</p>

                  <Link
                    to={`/professor/entregas/${submission.slug}`}
                    className="submission-card__action"
                  >
                    <span>{data.actionLabel}</span>
                    <ArrowRight size={18} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
