/**
 * PI² — Gestão de grupos (rota "/painel/grupos", exclusiva da coordenação).
 * -----------------------------------------------------------------------------
 * Lista os grupos do semestre com status, pendências e ações: adicionar o
 * link de documentação (modal simulado), abrir a documentação existente e
 * ver entregáveis pendentes. Fonte única: GROUPS em projectsMock.js.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiPlus, FiUsers } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { GROUPS, PROJECTS } from '../../mocks/projectsMock.js';
import styles from './GroupsPage.module.css';

const STATUS_FILTERS = [
  { value: null, label: 'Todos' },
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'em-analise', label: 'Em análise' },
  { value: 'publicado', label: 'Publicado' },
];

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
  const [filter, setFilter] = useState(null);
  const [linkTarget, setLinkTarget] = useState(null);
  const [linkValue, setLinkValue] = useState('');

  const visible = filter ? groups.filter((g) => g.status === filter) : groups;
  const pendingCount = groups.filter((g) => g.pendingLabel && !g.docsUrl).length;

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

  const openLinkModal = (group) => {
    setLinkTarget(group.id);
    setLinkValue('');
  };

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Gestão de grupos"
        subtitle={`${groups.length} grupos ativos · ${pendingCount} com pendência de documentação.`}
        action={
          <button type="button" className={styles.newButton}>
            <FiPlus aria-hidden="true" />
            Novo
          </button>
        }
      />

      <FilterChips options={STATUS_FILTERS} value={filter} onChange={setFilter} />

      <div className={styles.list}>
        {visible.map((group) => {
          const needsLink = group.pendingLabel && !group.docsUrl;
          return (
            <article key={group.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Badge tone={STATUS_TONES[group.status] ?? 'neutral'}>
                  {STATUS_LABELS[group.status] ?? group.status}
                </Badge>
                <span className={styles.semester}>{group.semesterLabel}</span>
              </div>

              <h3 className={styles.name}>{group.name}</h3>
              <p className={styles.members}>
                <FiUsers aria-hidden="true" />
                {group.members.join(', ')}
              </p>

              {group.pendingLabel && (
                <p className={`${styles.pending} ${needsLink ? styles.pendingAlert : ''}`}>
                  <FiFileText aria-hidden="true" />
                  {group.pendingLabel}
                </p>
              )}
              {group.pendingHint && <p className={styles.pendingHint}>{group.pendingHint}</p>}

              {group.docsUrl && (
                <p className={styles.docs}>
                  Documentação: <code>{group.docsUrl}</code>
                </p>
              )}

              <div className={styles.cardActions}>
                {needsLink ? (
                  <button type="button" className={styles.primaryAction} onClick={() => openLinkModal(group)}>
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
              </div>

              {group.extraAction && (
                <Link
                  to={`/painel/entrega/${
                    PROJECTS.find((p) => p.teamId === group.id)?.slug ?? 'aquasense'
                  }`}
                  className={styles.secondaryAction}
                >
                  {group.extraAction}
                </Link>
              )}
            </article>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>Nenhum grupo com esse status.</p>
      )}

      <p className={styles.footnote}>
        Os grupos são geridos pela coordenação do DSM. Professores orientadores
        acompanham as entregas de cada grupo.
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
