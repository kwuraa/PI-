/**
 * PI² — Gestão de grupos (rota "/painel/grupos", exclusiva da coordenação).
 * -----------------------------------------------------------------------------
 * Mockup desktop "Gestão de grupos": badge "Acompanhamento dos projetos" +
 * h1 "Gestão de grupos — DSM", 2 StatCards ("Grupos ativos" com borda
 * vermelha e "Grupos com pendências"), título "Grupos do semestre · 2026.2"
 * e grade de cards (nome primeiro, selo + semestre, integrantes, pendência
 * em caixa rosa, documentação e ações). Fonte única: GROUPS em projectsMock.
 * O modal "Adicionar link de documentação" simula a correção da pendência.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import StatCard from '../../components/ui/StatCard/StatCard.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { GROUPS, PROJECTS } from '../../mocks/projectsMock.js';
import styles from './GroupsPage.module.css';

const STATUS_TONES = {
  rascunho: 'neutral',
  'em-analise': 'warning',
  publicado: 'success',
};

const STATUS_LABELS = {
  rascunho: 'Rascunho',
  'em-analise': 'Em análise',
  publicado: 'Publicado',
};

export default function GroupsPage() {
  const [groups, setGroups] = useState(GROUPS);
  const [linkTarget, setLinkTarget] = useState(null);
  const [linkValue, setLinkValue] = useState('');

  /** Pendências de QUALQUER tipo (mockup: "2 Grupos com pendências"). */
  const pendingCount = groups.filter((g) => g.pendingLabel).length;

  /** Salva o link de documentação e remove a pendência do grupo. */
  const saveLink = (event) => {
    event.preventDefault();
    const url = linkValue.trim();
    if (!url || !linkTarget) return;
    setGroups((prev) =>
      prev.map((group) =>
        group.id === linkTarget
          ? { ...group, docsUrl: url, pendingLabel: null, pendingHint: null, action: 'Abrir documentação' }
          : group
      )
    );
    setLinkTarget(null);
    setLinkValue('');
  };

  /** "Ana Costa, Lucas Silva + 2 alunos" — nomes + contador do mockup. */
  const membersLine = (members) => {
    const names = members.filter((m) => !m.startsWith('+'));
    const extra = members.find((m) => m.startsWith('+'));
    return [names.join(', '), extra].filter(Boolean).join(' ');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge tone="primary">Acompanhamento dos projetos</Badge>
        <h1 className={styles.title}>Gestão de grupos — DSM</h1>
        <p className={styles.lead}>
          Acompanhe as pendências, documentação e evolução consolidada dos
          grupos de DSM.
        </p>
      </header>

      <div className={styles.stats}>
        <StatCard tone="accent" value={groups.length} label="Grupos ativos" />
        <StatCard value={pendingCount} label="Grupos com pendências" />
      </div>

      <h2 className={styles.sectionTitle}>Grupos do semestre · 2026.2</h2>

      <div className={styles.list}>
        {groups.map((group) => {
          const needsLink = group.pendingLabel && !group.docsUrl;
          return (
            <article key={group.id} className={styles.card}>
              <h3 className={styles.name}>{group.name}</h3>

              <div className={styles.meta}>
                <Badge tone={STATUS_TONES[group.status] ?? 'neutral'}>
                  {STATUS_LABELS[group.status] ?? group.status}
                </Badge>
                <span className={styles.semester}>{group.semesterLabel}</span>
              </div>

              <p className={styles.members}>{membersLine(group.members)}</p>

              {/* pendência de link → caixa rosa com dica */}
              {needsLink && (
                <div className={styles.pendingBox}>
                  <FiAlertCircle aria-hidden="true" />
                  <div className={styles.pendingTexts}>
                    <strong>{group.pendingLabel}</strong>
                    {group.pendingHint && <p>{group.pendingHint}</p>}
                  </div>
                </div>
              )}

              {/* outras pendências → linha vermelha simples */}
              {group.pendingLabel && !needsLink && (
                <p className={styles.pendingLine}>{group.pendingLabel}</p>
              )}

              {group.docsUrl && (
                <div className={styles.docs}>
                  <span className={styles.docsLabel}>Documentação</span>
                  <a
                    href={`https://${group.docsUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {group.docsUrl}
                  </a>
                </div>
              )}

              <div className={styles.cardActions}>
                {needsLink ? (
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => {
                      setLinkTarget(group.id);
                      setLinkValue('');
                    }}
                  >
                    {group.action}
                    <FiArrowRight aria-hidden="true" />
                  </button>
                ) : (
                  <a
                    className={styles.primaryAction}
                    href={`https://${group.docsUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {group.action}
                    <FiArrowRight aria-hidden="true" />
                  </a>
                )}

                {group.extraAction && (
                  <div className={styles.secondarySlot}>
                    <Link
                      to={`/painel/entrega/${
                        PROJECTS.find((p) => p.teamId === group.id)?.slug ?? 'aquasense'
                      }`}
                      className={styles.secondaryAction}
                    >
                      {group.extraAction}
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {groups.length === 0 && (
        <p className={styles.empty}>Nenhum grupo encontrado.</p>
      )}

      <p className={styles.footnote}>
        Os links de documentação devem permitir o acesso da coordenação e dos
        professores orientadores do DSM.
      </p>

      {/* -------------------------------------- modal de link */}
      <Modal
        open={Boolean(linkTarget)}
        onClose={() => setLinkTarget(null)}
        title="Adicionar link de documentação"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setLinkTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={saveLink} disabled={!linkValue.trim()}>
              Salvar link
            </Button>
          </div>
        }
      >
        <form onSubmit={saveLink}>
          <TextField
            label="URL da documentação"
            required
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            placeholder="github.com/equipe/projeto"
            hint="Informe o repositório ou a pasta compartilhada do grupo."
          />
        </form>
      </Modal>
    </div>
  );
}
