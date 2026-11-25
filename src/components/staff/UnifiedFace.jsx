/**
 * PI² — Face unificada de /painel (professor + coordenador no mesmo espaço).
 * -----------------------------------------------------------------------------
 * Extraído de StaffPanelPage.jsx na separação "um componente por arquivo"
 * (item 6), junto com as classes de StaffPanel.module.css que só ela usa.
 *
 * Conteúdo (mockup 07): saudação dupla, abas "Painel unificado | Atalhos"
 * (a aba Atalhos tem h1 próprio), as seções "Como professor" e "Como
 * coordenador" lado a lado, o card único de métricas do coordenador, o alerta
 * de grupo sem link e as linhas de atalho de cada papel.
 *
 * Usa as classes de estrutura de StaffPanelShared.module.css
 * (`.stats`, `.block`, `.blockTitle`).
 *
 * Uso (dentro da StaffPanelPage):
 *   <UnifiedFace user={user} />
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiFileText,
  FiLink2,
  FiSliders,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Callout from '../ui/Callout/Callout.jsx';
import ListRow from '../ui/ListRow/ListRow.jsx';
import PageHeader from '../ui/PageHeader/PageHeader.jsx';
import StatCard from '../ui/StatCard/StatCard.jsx';
import Tabs from '../ui/Tabs/Tabs.jsx';
import { METRICS } from './staffMetrics.js';
import shared from './StaffPanelShared.module.css';
import styles from './UnifiedFace.module.css';

const TABS = [
  { id: 'painel', label: 'Painel unificado' },
  { id: 'atalhos', label: 'Atalhos' },
];

export default function UnifiedFace({ user }) {
  const [tab, setTab] = useState('painel');
  const who = user?.displayName ?? user?.name ?? '';
  /** "prof. Rafael" → "Prof. Rafael" (lead da aba Atalhos). */
  const whoCap = who.charAt(0).toUpperCase() + who.slice(1);

  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="primary">Espaço do professor e coordenador</Badge>}
        gap="md"
        title={
          tab === 'atalhos'
            ? 'Atalhos'
            : `Olá, ${who}. Você orienta e coordena.`
        }
        lead={
          tab === 'atalhos'
            ? `${whoCap}, suas ações para orientar e coordenar, reunidas aqui.`
            : 'Suas orientações e a gestão do curso, no mesmo lugar.'
        }
      />

      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === 'painel' ? (
        <>
          {/* seções professor/coordenador lado a lado (mockup 07) */}
          <div className={styles.splitTwo}>
            <section className={shared.block}>
              <h2 className={shared.blockTitle}>Como professor</h2>
              <div className={shared.stats}>
                <StatCard
                  tone="primary"
                  value={METRICS.reviewQueue}
                  label="Aguardando revisão"
                />
                <StatCard
                  value={METRICS.advised}
                  label="Projetos sob orientação"
                />
              </div>
            </section>

            <section className={shared.block}>
              <h2 className={shared.blockTitle}>Como coordenador</h2>
              {/* card único com as 2 métricas em linhas inline (mockup 07) */}
              <div className={styles.combinedCard}>
                <div className={styles.combinedRow}>
                  <span className={styles.combinedLabel}>
                    {METRICS.activeGroups} Grupos ativos
                  </span>
                  <FiUsers className={styles.combinedIcon} aria-hidden="true" />
                </div>
                <div className={styles.combinedRow}>
                  <span className={styles.combinedLabel}>
                    {METRICS.pendingDeliveries} Entregáveis pendentes
                  </span>
                  <FiFileText
                    className={`${styles.combinedIcon} ${styles.combinedIconAlt}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </section>
          </div>

          {METRICS.pendingGroup && (
            <Callout
              icon={<FiLink2 size={22} aria-hidden="true" />}
              title="Grupo sem link de documentação"
              action={
                <Link to="/painel/grupos">
                  <Button icon={<FiArrowRight aria-hidden="true" />}>
                    Resolver
                  </Button>
                </Link>
              }
            >
              Confira o grupo e regularize o link para acompanhar as entregas.
            </Callout>
          )}
        </>
      ) : (
        <div className={styles.splitTwo}>
          <section className={shared.block}>
            <h2 className={shared.blockTitle}>Professor</h2>
            <div className={styles.rows}>
              <ListRow
                icon={<FiTrendingUp aria-hidden="true" />}
                title="Histórico e evolução do grupo"
                badge={<Badge tone="neutral">Professor</Badge>}
                to="/painel/evolucao"
              />
            </div>
          </section>

          <section className={shared.block}>
            <h2 className={shared.blockTitle}>Coordenador</h2>
            <div className={styles.rows}>
              <ListRow
                icon={<FiFileText aria-hidden="true" />}
                title="Relatório consolidado"
                badge={<Badge tone="neutral">Coordenador</Badge>}
                to="/painel/relatorio-consolidado"
              />
              <ListRow
                icon={<FiSliders aria-hidden="true" />}
                title="Gestão de grupos"
                badge={<Badge tone="neutral">Coordenador</Badge>}
                to="/painel/grupos"
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
