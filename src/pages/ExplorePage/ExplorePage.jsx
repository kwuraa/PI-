import React, { useEffect, useState } from 'react';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import FilterChip from '../../components/ui/FilterChip/FilterChip';
import HighlightCard from '../../components/ui/HighlightCard/HighlightCard';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import ExploreProjectCard from '../../components/ui/ExploreProjectCard/ExploreProjectCard';
import { exploreService } from '../../services/exploreService';
import { STUDENT_NAV_ITEMS } from '../../config/navigation';
import './ExplorePage.css';

/**
 * Tela "Explorar projetos".
 * Busca e filtros são locais (sem API); o feed vem de exploreService.
 */
export default function ExplorePage() {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const { user, header, search, filters, highlight, sections } = feed;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

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

        <SearchBar
          placeholder={search.placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          filterLabel={search.actionLabel}
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
      </PageShell>

      <BottomNav items={STUDENT_NAV_ITEMS} />
    </>
  );
}
