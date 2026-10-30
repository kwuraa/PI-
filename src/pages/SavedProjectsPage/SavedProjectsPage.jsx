import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import SearchBar from '../../components/ui/SearchBar/SearchBar';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import ExploreProjectCard from '../../components/ui/ExploreProjectCard/ExploreProjectCard';
import { Compass } from '../../components/icons';
import { savedProjectsService } from '../../services/savedProjectsService';
import './SavedProjectsPage.css';

/**
 * Tela "Projetos salvos".
 * A busca filtra a lista no cliente; a remoção tira o cartão do
 * estado local (no back-end futuro: DELETE /api/saved-projects/:id).
 */
export default function SavedProjectsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSaved() {
      try {
        const response = await savedProjectsService.get();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar os salvos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSaved();

    return () => {
      active = false;
    };
  }, []);

  function handleRemove(projectId) {
    setData((current) => ({
      ...current,
      list: {
        ...current.list,
        projects: current.list.projects.filter((p) => p.id !== projectId),
      },
    }));
  }

  if (loading) {
    return (
      <PageShell>
        <p className="saved__status" role="status">
          Carregando seus projetos salvos…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="saved__status saved__status--error" role="alert">
          {error || 'Não foi possível carregar os projetos salvos.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, search, list, footerAction } = data;
  const projects = list.projects;
  const term = query.trim().toLowerCase();
  const visible = term
    ? projects.filter((p) =>
        `${p.title} ${p.category} ${p.authors}`.toLowerCase().includes(term)
      )
    : projects;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="saved__intro">
          <Badge tone="primary">{header.badge}</Badge>
          <h1 className="saved__title">{header.title}</h1>
          <p className="saved__subtitle">{header.subtitle}</p>
        </section>

        <SearchBar
          placeholder={search.placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          showFilter={false}
        />

        <section className="saved__section">
          <SectionHeader
            title={`${list.title} (${projects.length})`}
            actionLabel={list.action.label}
          />

          {visible.length > 0 ? (
            <div className="saved__list">
              {visible.map((project) => (
                <ExploreProjectCard
                  key={project.id}
                  project={project}
                  saved
                  onRemove={() => handleRemove(project.id)}
                />
              ))}
            </div>
          ) : (
            <p className="saved__empty">
              {term
                ? 'Nenhum projeto encontrado para sua busca.'
                : 'Você ainda não salvou projetos.'}
            </p>
          )}
        </section>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate(footerAction.href)}
        >
          <Compass size={18} /> {footerAction.label}
        </Button>
      </PageShell>

    </>
  );
}
