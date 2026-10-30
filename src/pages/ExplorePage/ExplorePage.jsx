import React, { useEffect, useState } from 'react';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterChip from '../../components/ui/FilterChip/FilterChip';
import HighlightCard from '../../components/ui/HighlightCard/HighlightCard';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import ExploreProjectCard from '../../components/ui/ExploreProjectCard/ExploreProjectCard';
import FilterSheet from '../../components/ui/FilterSheet/FilterSheet';
import { X } from '../../components/icons';
import { exploreService } from '../../services/exploreService';
import { STUDENT_NAV_ITEMS } from '../../config/navigation';
import './ExplorePage.css';

/** Estado padrão do painel de filtros. */
const DEFAULT_DRAFT = {
  course: 'all',
  year: '2026',
  sort: 'Mais recentes',
  type: 'all',
};
const NO_YEAR = 'Todos os anos';

/**
 * Tela "Explorar projetos".
 * A busca é local (sem API); o feed vem de exploreService.
 * O painel de filtros abre em bottom sheet e, ao aplicar,
 * a tela entra no estado "resultados".
 */
export default function ExplorePage() {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [applied, setApplied] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      try {
        const data = await exploreService.getFeed();
        if (active) setFeed(data);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar os projetos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFeed();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="explore__status" role="status">
          Carregando projetos…
        </p>
      </PageShell>
    );
  }

  if (error || !feed) {
    return (
      <PageShell>
        <p className="explore__status explore__status--error" role="alert">
          {error || 'Não foi possível carregar os projetos.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, search, filters, highlight, sections, results, filterPanel } = feed;

  const courseOf = (id) => filterPanel.courses.find((course) => course.id === id);
  const typeOf = (id) => filterPanel.types.find((type) => type.id === id);

  /** Quantidade que o botão do sheet promete mostrar. */
  const draftCount = courseOf(draft.course)?.count ?? 0;
  const appliedCount = applied ? courseOf(applied.course)?.count ?? 0 : 0;

  /** Chips ativos no estado resultados (removíveis com ×). */
  const appliedChips = applied
    ? [
        applied.course !== 'all' && {
          id: 'course',
          label: courseOf(applied.course)?.name,
          tone: 'primary',
        },
        applied.year !== NO_YEAR && {
          id: 'year',
          label: applied.year,
          tone: 'neutral',
        },
        applied.type !== 'all' && {
          id: 'type',
          label: typeOf(applied.type)?.label,
          tone: 'primary',
        },
      ].filter(Boolean)
    : [];

  function handleApply() {
    setApplied({ ...draft });
    setFiltersOpen(false);
  }

  function handleClear() {
    setDraft(DEFAULT_DRAFT);
    setApplied(null);
    setFiltersOpen(false);
  }

  function handleRemoveChip(id) {
    setApplied((current) => {
      if (!current) return null;

      const next = {
        ...current,
        [id]: id === 'course' || id === 'type' ? 'all' : NO_YEAR,
      };

      const stillFiltered =
        next.course !== 'all' || next.year !== NO_YEAR || next.type !== 'all';

      return stillFiltered ? next : null;
    });
  }

  /* Busca + filtros rápidos (compartilhado entre os estados) */
  const searchBlock = (
    <>
      <SearchBar
        placeholder={search.placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        filterLabel={search.actionLabel}
        onFilterClick={() => setFiltersOpen(true)}
      />

      <div className="explore__filters">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            active={filter.id === activeFilter}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </FilterChip>
        ))}
      </div>
    </>
  );

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        {applied ? (
          /* ---------- Estado: resultados com filtros aplicados ---------- */
          <>
            <section className="explore__results">
              <h1 className="explore__results-headline">{results.headline}</h1>

              <div className="explore__applied">
                {appliedChips.map((chip) => (
                  <FilterChip
                    key={chip.id}
                    tone={chip.tone}
                    onClick={() => handleRemoveChip(chip.id)}
                  >
                    {chip.label} <X size={14} />
                  </FilterChip>
                ))}
              </div>

              <p className="explore__results-count">
                {results.countTemplate.replace('{count}', String(appliedCount))} · {applied.sort}
              </p>

              <div className="explore__results-list">
                {results.projects.map((project) => (
                  <article className="explore__result" key={project.id}>
                    <strong className="explore__result-title">{project.title}</strong>
                    <span className="explore__result-meta">{project.meta}</span>
                  </article>
                ))}
              </div>
            </section>

            {searchBlock}
          </>
        ) : (
          /* ---------- Estado: feed padrão ---------- */
          <>
            <section className="explore__intro">
              <p className="explore__greeting">{header.greeting}</p>
              <h1 className="explore__headline">
                {header.headline.split('\n').map((line, index) => (
                  <React.Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
            </section>

            {searchBlock}

            <HighlightCard
              eyebrow={highlight.eyebrow}
              title={highlight.title}
              meta={highlight.meta}
            />

            {sections.map((section) => (
              <section key={section.id} className="explore__section">
                <SectionHeader title={section.title} actionLabel={section.action.label} />

                <div className="explore__list">
                  {section.projects.map((project) => (
                    <ExploreProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        <FilterSheet
          open={filtersOpen}
          panel={filterPanel}
          draft={draft}
          count={draftCount}
          onDraftChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          onApply={handleApply}
          onClear={handleClear}
          onClose={() => setFiltersOpen(false)}
        />
      </PageShell>

      <BottomNav items={STUDENT_NAV_ITEMS} />
    </>
  );
}
