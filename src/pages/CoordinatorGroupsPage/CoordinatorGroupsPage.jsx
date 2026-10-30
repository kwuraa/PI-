import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import { ArrowRight, AlertTriangle } from '../../components/icons';
import { groupsService } from '../../services/groupsService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './CoordinatorGroupsPage.css';

const STATUS_TONES = {
  draft: 'neutral',
  'in-review': 'amber',
  published: 'success',
};

/**
 * Tela "Gestão de grupos" (/coordenador/grupos).
 * Acompanha pendências de documentação e entregáveis por grupo.
 */
export default function CoordinatorGroupsPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await groupsService.getGroups();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar os grupos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="groups__status" role="status">
          Carregando grupos…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="groups__status groups__status--error" role="alert">
          {error || 'Não foi possível carregar os grupos.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, stats, section, groups } = data;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="groups__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="groups__title">{header.title}</h1>
          <p className="groups__description">{header.description}</p>
        </section>

        <div className="groups__stats">
          {stats.map((stat) => (
            <article className="groups__stat" key={stat.id}>
              <strong className="groups__stat-value">{stat.value}</strong>
              <span className="groups__stat-label">{stat.label}</span>
            </article>
          ))}
        </div>

        <section className="groups__section">
          <SectionHeader
            title={section.title}
            actionLabel={section.actionLabel}
          />

          {groups.map((group) => (
            <article className="groups__card" key={group.id}>
              <header className="groups__card-header">
                <Badge tone={STATUS_TONES[group.status]}>
                  {group.statusLabel}
                </Badge>
                <span className="groups__class-meta">{group.classMeta}</span>
              </header>

              <h3 className="groups__card-title">{group.title}</h3>
              <p className="groups__members">{group.members}</p>

              {group.alert && (
                <p className="groups__alert">
                  <AlertTriangle size={16} aria-hidden="true" />
                  <span>{group.alert}</span>
                </p>
              )}

              {group.alertDescription && (
                <p className="groups__alert-description">
                  {group.alertDescription}
                </p>
              )}

              {group.docs && (
                <div className="groups__docs">
                  <span className="groups__docs-label">{group.docs.label}</span>
                  <span className="groups__docs-url">{group.docs.url}</span>
                </div>
              )}

              {group.action.kind === 'add' ? (
                <Link
                  to={`/coordenador/grupos/${group.id}/link`}
                  className="groups__action"
                >
                  <span>{group.action.label}</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  to={`/coordenador/grupos/${group.id}`}
                  className="groups__action"
                >
                  <span>{group.action.label}</span>
                  <ArrowRight size={18} />
                </Link>
              )}

              {group.extraAction && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate(group.extraAction.href)}
                >
                  {group.extraAction.label}
                </Button>
              )}
            </article>
          ))}
        </section>

        <p className="groups__footer">{data.footer}</p>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
