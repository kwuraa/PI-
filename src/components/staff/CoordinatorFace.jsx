import { Link } from 'react-router-dom';

import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Callout from '../ui/Callout/Callout.jsx';
import ListRow from '../ui/ListRow/ListRow.jsx';
import PageHeader from '../ui/PageHeader/PageHeader.jsx';
import SectionHeader from '../ui/SectionHeader/SectionHeader.jsx';
import StatCard from '../ui/StatCard/StatCard.jsx';
import { METRICS } from './staffMetrics.js';
import shared from './StaffPanelShared.module.css';
import styles from './CoordinatorFace.module.css';

export default function CoordinatorFace() {
  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="primary">Área do coordenador</Badge>}
        gap="md"
        title="Olá, coordenador(a). Vamos acompanhar o PI?"
        lead="Acompanhe os grupos DSM, suas entregas e a evolução ao longo dos semestres."
      />

      <div className={shared.stats}>
        <StatCard tone="primary" value={METRICS.activeGroups} label="Grupos ativos" />
        <StatCard value={METRICS.pendingDeliveries} label="Entregáveis pendentes" />
      </div>

      {/* alerta + áreas em 2 colunas no desktop */}
      <div className={styles.splitCoordinator}>
        {METRICS.pendingGroup && (
          <Callout
            stacked
            title="Grupo sem link de documentação"
            action={
              <Link to="/painel/grupos">
                <Button>Resolver</Button>
              </Link>
            }
          >
            {METRICS.pendingGroup.name} · {METRICS.pendingGroup.semesterLabel}
          </Callout>
        )}

        <section className={styles.sideCard}>
          <SectionHeader
            title="Áreas da coordenação"
            subtitle="Gerencie os grupos e acompanhe a evolução consolidada do DSM."
          />
          <div className={styles.rowsPlain}>
            <ListRow
              danger
              plain
              title="Relatório consolidado de evolução"
              to="/painel/relatorio-consolidado"
            />
            <ListRow danger plain title="Gestão de grupos" to="/painel/grupos" />
          </div>
        </section>
      </div>
    </>
  );
}
