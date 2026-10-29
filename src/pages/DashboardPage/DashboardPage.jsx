import React, { useEffect, useState } from 'react';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Tabs from '../../components/ui/Tabs/Tabs';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import StatCard from '../../components/ui/StatCard/StatCard';
import ListRow from '../../components/ui/ListRow/ListRow';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import { dashboardService } from '../../services/dashboardService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './DashboardPage.css';

const TAB_ITEMS = [
  { id: 'overview', label: 'Painel unificado' },
  { id: 'shortcuts', label: 'Atalhos' },
];

/**
 * Tela "Painel unificado" (área logada).
 * Os dados chegam via dashboardService — mock hoje, API real amanhã.
 */
export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const data = await dashboardService.get();
        if (active) setDashboard(data);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o painel.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="dashboard__status" role="status">
          Carregando painel…
        </p>
      </PageShell>
    );
  }

  if (error || !dashboard) {
    return (
      <PageShell>
        <p className="dashboard__status dashboard__status--error" role="alert">
          {error || 'Não foi possível carregar o painel.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, sections, alert } = dashboard;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="dashboard__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="dashboard__greeting">
            {header.greeting}
            <br />
            {header.headline}
          </h1>
          <p className="dashboard__description">{header.description}</p>
        </section>

        <Tabs items={TAB_ITEMS} activeId={activeTab} onChange={setActiveTab} />

        {activeTab === 'overview' ? (
          sections.map((section) => (
            <section key={section.id} className="dashboard__section">
              <SectionHeader title={section.title} />

              {section.stats.length > 0 && (
                <div className="dashboard__stats">
                  {section.stats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                      variant={stat.variant}
                    />
                  ))}
                </div>
              )}

              {section.rows.length > 0 && (
                <div className="dashboard__rows">
                  {section.rows.map((row) => (
                    <ListRow
                      key={row.id}
                      icon={row.icon}
                      value={row.value}
                      label={row.label}
                      href={row.href}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        ) : (
          <section className="dashboard__section">
            <SectionHeader title="Atalhos" />
            <div className="dashboard__rows">
              <ListRow
                icon="users"
                value={4}
                label="Grupos ativos"
                href="/coordenador/grupos"
              />
              <ListRow
                icon="file"
                value={2}
                label="Entregáveis pendentes"
                href="/coordenador/entregaveis"
              />
            </div>
          </section>
        )}

        {alert && (
          <AlertCard
            icon={alert.icon}
            title={alert.title}
            description={alert.description}
            action={alert.action}
          />
        )}
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
