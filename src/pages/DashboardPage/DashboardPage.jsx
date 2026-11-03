import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import Badge from '../../components/ui/Badge/Badge';
import Tabs from '../../components/ui/Tabs/Tabs';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import StatCard from '../../components/ui/StatCard/StatCard';
import ListRow from '../../components/ui/ListRow/ListRow';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import PendingCard from '../../components/ui/PendingCard/PendingCard';
import ReviewCard from '../../components/ui/ReviewCard/ReviewCard';
import InfoCard from '../../components/ui/InfoCard/InfoCard';
import LinksCard from '../../components/ui/LinksCard/LinksCard';
import ShortcutCard from '../../components/ui/ShortcutCard/ShortcutCard';
import { dashboardService } from '../../services/dashboardService';
import './DashboardPage.css';

/** Perfis aceitos pelo painel (?role=... na URL). */
const VALID_ROLES = ['professor', 'coordinator', 'both'];

/**
 * Tela "Painel" (/painel) — renderiza conforme o perfil:
 *  - professor:   pendências de revisão e orientação
 *  - coordinator: grupos, entregáveis e coordenação
 *  - both:        painel unificado com abas (Painel unificado / Atalhos)
 *
 * O perfil vem da query ?role= (demo); com back-end, a API decide
 * pelo usuário da sessão e a página não muda.
 */
export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = VALID_ROLES.includes(roleParam) ? roleParam : 'professor';

  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('panel');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const data = await dashboardService.get(role);
        if (active) setDashboard(data);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o painel.');
      } finally {
        if (active) setLoading(false);
      }
    }

    setActiveTab('panel');
    loadDashboard();

    return () => {
      active = false;
    };
  }, [role]);

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

  const { user, header, tabs } = dashboard;
  const isUnified = Boolean(tabs);
  const onShortcuts = isUnified && activeTab === 'shortcuts';

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="dashboard__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="dashboard__greeting">
            {onShortcuts ? (
              dashboard.shortcuts.title
            ) : (
              <>
                {header.greeting}
                <br />
                {header.headline}
              </>
            )}
          </h1>
          <p className="dashboard__description">
            {onShortcuts ? dashboard.shortcuts.description : header.description}
          </p>
        </section>

        {isUnified && (
          <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />
        )}

        {isUnified ? (
          onShortcuts ? (
            <ShortcutsPanel shortcuts={dashboard.shortcuts} />
          ) : (
            <UnifiedOverview
              overview={dashboard.overview}
              alert={dashboard.alert}
            />
          )
        ) : (
          <RoleOverview dashboard={dashboard} />
        )}
      </PageShell>

    </>
  );
}

/** Painel dos perfis professor e coordenador (sem abas). */
function RoleOverview({ dashboard }) {
  const { stats, pendingCard, sections, areas, alert } = dashboard;

  return (
    <>
      <div className="dashboard__stats">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            variant={stat.variant}
          />
        ))}
      </div>

      {pendingCard && <PendingCard {...pendingCard} />}

      {sections.map((section) => (
        <section key={section.id} className="dashboard__section">
          <SectionHeader
            title={section.title}
            actionLabel={section.action?.label}
          />
          <div className="dashboard__cards">
            {section.cards.map((card) =>
              card.type === 'review' ? (
                <ReviewCard key={card.id} review={card} />
              ) : (
                <InfoCard
                  key={card.id}
                  badge={card.badge}
                  title={card.title}
                  meta={card.meta}
                />
              )
            )}
          </div>
        </section>
      ))}

      {alert && (
        <AlertCard
          icon={alert.icon}
          title={alert.title}
          description={alert.description}
          action={alert.action}
        />
      )}

      {areas && (
        <section className="dashboard__section">
          <SectionHeader title={areas.title} />
          <LinksCard description={areas.description} links={areas.links} />
        </section>
      )}
    </>
  );
}

/** Painel unificado (perfis professor + coordenador), aba "Painel unificado". */
function UnifiedOverview({ overview, alert }) {
  const { professor, coordinator } = overview;

  return (
    <>
      <section className="dashboard__section">
        <SectionHeader title={professor.title} />
        <div className="dashboard__stats">
          {professor.stats.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              variant={stat.variant}
            />
          ))}
        </div>
        <div className="dashboard__rows">
          <ListRow {...professor.pendingRow} />
        </div>
      </section>

      <section className="dashboard__section">
        <SectionHeader title={coordinator.title} />
        <div className="dashboard__rows">
          {coordinator.rows.map((row) => (
            <ListRow
              key={row.id}
              icon={row.icon}
              value={row.value}
              label={row.label}
              tone={row.tone}
              href={row.href}
            />
          ))}
        </div>
      </section>

      {alert && (
        <AlertCard
          icon={alert.icon}
          title={alert.title}
          description={alert.description}
          action={alert.action}
        />
      )}
    </>
  );
}

/** Painel unificado, aba "Atalhos" — agrupamentos por perfil. */
function ShortcutsPanel({ shortcuts }) {
  return (
    <>
      {shortcuts.groups.map((group) => (
        <section key={group.id} className="dashboard__section">
          <SectionHeader title={group.title} />
          <ul className="dashboard__rows">
            {group.items.map((item) => (
              <ShortcutCard key={item.id} shortcut={item} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
