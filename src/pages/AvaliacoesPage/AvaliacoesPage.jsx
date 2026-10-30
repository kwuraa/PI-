import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Select from '../../components/ui/Select/Select';
import { ArrowLeft, Check, Lock } from '../../components/icons';
import { evaluationService } from '../../services/evaluationService';
import './AvaliacoesPage.css';

/**
 * Tela "Avaliações" (/painel/avaliacoes) — professor e coordenador.
 * Aba "Professores": selecione um docente e registre a avaliação.
 * Aba "Pares": ciclo de avaliação entre coordenadores.
 */
export default function AvaliacoesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('professors');
  const [teachers, setTeachers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [cycleClosed, setCycleClosed] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await evaluationService.getEvaluations();
        if (active) {
          setData(response);
          setTeachers(response.professors.teachers);
          setSelectedId(response.professors.teachers[0]?.id ?? null);
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar as avaliações.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  function updateTeacher(id, patch) {
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === id ? { ...teacher, ...patch } : teacher
      )
    );
    setFeedback({ type: '', text: '' });
  }

  function handleSave(teacher) {
    const value = Number(String(teacher.score).replace(',', '.'));

    if (!(value >= 0 && value <= 10) || !teacher.comment.trim()) {
      setFeedback({ type: 'error', text: data.professors.helper });
      return;
    }

    updateTeacher(teacher.id, { status: 'done' });
    setFeedback({ type: 'success', text: data.professors.savedFeedback });
  }

  if (loading) {
    return (
      <PageShell>
        <p className="avaliacoes__status" role="status">
          Carregando avaliações…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="avaliacoes__status avaliacoes__status--error" role="alert">
          {error || 'Não foi possível carregar as avaliações.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, tabs, semester, professors, peers } = data;

  const selected = teachers.find((teacher) => teacher.id === selectedId);
  const doneCount = teachers.filter((t) => t.status === 'done').length;
  const countLabel = professors.countTemplate
    .replace('{done}', String(doneCount))
    .replace('{total}', String(teachers.length));

  const peersDone = peers.participants.filter((p) => p.status === 'done').length;
  const peersTotal = peers.participants.length;
  const peersPending = peersTotal - peersDone;
  const allPeersDone = peersPending === 0;

  const cycleLabel = peers.cycle.labelTemplate
    .replace('{done}', String(peersDone))
    .replace('{total}', String(peersTotal));
  const noticeDescription = peers.notice.descriptionTemplate
    .replaceAll('{pending}', String(peersPending))
    .replaceAll('{total}', String(peersTotal));

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="avaliacoes__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="avaliacoes__intro">
          <h1 className="avaliacoes__title">{header.title}</h1>
          <p className="avaliacoes__description">{header.description}</p>
        </section>

        {/* Abas segmentadas */}
        <div className="avaliacoes__tabs" role="tablist" aria-label="Tipo de avaliação">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`avaliacoes__tab ${
                activeTab === tab.id ? 'avaliacoes__tab--active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Select
          label={semester.label}
          options={semester.options}
          defaultValue={semester.value}
        />

        {activeTab === 'professors' && (
          <section className="avaliacoes__section">
            <div className="avaliacoes__section-header">
              <h2 className="avaliacoes__heading">{professors.sectionTitle}</h2>
              <span className="avaliacoes__count">{countLabel}</span>
            </div>

            {teachers.map((teacher) => (
              <button
                type="button"
                key={teacher.id}
                className={`avaliacoes__teacher ${
                  selectedId === teacher.id ? 'avaliacoes__teacher--selected' : ''
                }`}
                aria-pressed={selectedId === teacher.id}
                onClick={() => setSelectedId(teacher.id)}
              >
                <span className="avaliacoes__avatar" aria-hidden="true">
                  {teacher.initials}
                </span>

                <span className="avaliacoes__teacher-text">
                  <strong className="avaliacoes__teacher-name">
                    {teacher.name}
                  </strong>
                  <span className="avaliacoes__teacher-meta">
                    {teacher.meta ?? teacher.discipline}
                  </span>
                </span>

                <Badge tone={teacher.status === 'done' ? 'success' : 'amber'}>
                  {teacher.status === 'done' ? 'Avaliado' : 'Pendente'}
                </Badge>
              </button>
            ))}

            {selected && (
              <article className="avaliacoes__form-card">
                <span className="avaliacoes__kicker">
                  {professors.selectedKickers[selected.gender]}
                </span>
                <h2 className="avaliacoes__form-name">{selected.name}</h2>
                <p className="avaliacoes__form-meta">
                  {selected.discipline} · {semester.value}
                </p>

                <label
                  className="avaliacoes__label"
                  htmlFor={`score-${selected.id}`}
                >
                  {professors.scoreLabel}
                </label>
                <div className="avaliacoes__score-control">
                  <input
                    id={`score-${selected.id}`}
                    type="text"
                    inputMode="decimal"
                    className="avaliacoes__score"
                    value={selected.score}
                    onChange={(event) =>
                      updateTeacher(selected.id, { score: event.target.value })
                    }
                  />
                  <span className="avaliacoes__score-suffix">
                    {professors.scoreSuffix}
                  </span>
                </div>

                <label
                  className="avaliacoes__label"
                  htmlFor={`comment-${selected.id}`}
                >
                  {professors.commentLabel}
                </label>
                <textarea
                  id={`comment-${selected.id}`}
                  className="avaliacoes__comment"
                  rows={4}
                  value={selected.comment}
                  onChange={(event) =>
                    updateTeacher(selected.id, { comment: event.target.value })
                  }
                />

                <p className="avaliacoes__helper">{professors.helper}</p>

                <Button fullWidth onClick={() => handleSave(selected)}>
                  <Check size={18} /> {professors.saveLabel}
                </Button>

                {feedback.text && (
                  <p
                    className={`avaliacoes__feedback avaliacoes__feedback--${feedback.type}`}
                    role="status"
                  >
                    {feedback.text}
                  </p>
                )}
              </article>
            )}
          </section>
        )}

        {activeTab === 'peers' && (
          <section className="avaliacoes__section">
            <article className="avaliacoes__cycle">
              <header className="avaliacoes__cycle-header">
                <strong className="avaliacoes__cycle-title">
                  {peers.cycle.title}
                </strong>
                <Badge tone={peers.cycle.statusBadge.tone}>
                  {peers.cycle.statusBadge.label}
                </Badge>
              </header>

              <p className="avaliacoes__cycle-label">{cycleLabel}</p>

              <progress
                className="avaliacoes__cycle-progress"
                value={peersDone}
                max={peersTotal}
                aria-label={cycleLabel}
              />

              <p className="avaliacoes__cycle-description">
                {peers.cycle.description}
              </p>
            </article>

            <h2 className="avaliacoes__heading">{peers.sectionTitle}</h2>

            <div className="avaliacoes__peers-card">
              {peers.participants.map((person) => (
                <div className="avaliacoes__peer" key={person.id}>
                  <span className="avaliacoes__avatar" aria-hidden="true">
                    {person.initials}
                  </span>

                  <span className="avaliacoes__teacher-text">
                    <strong className="avaliacoes__teacher-name">
                      {person.name}
                    </strong>
                    <span className="avaliacoes__teacher-meta">
                      {person.meta}
                    </span>
                  </span>

                  <Badge tone={person.status === 'done' ? 'success' : 'amber'}>
                    {person.statusLabel}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="avaliacoes__peers-card">
              <div className="avaliacoes__peer">
                <span className="avaliacoes__avatar" aria-hidden="true">
                  {peers.selfCard.initials}
                </span>

                <strong className="avaliacoes__teacher-name">
                  {peers.selfCard.name}
                </strong>

                <Badge tone="neutral">{peers.selfCard.badge}</Badge>
              </div>
            </div>

            <aside className="avaliacoes__notice">
              <header className="avaliacoes__notice-header">
                <Lock size={18} aria-hidden="true" />
                <strong className="avaliacoes__notice-title">
                  {peers.notice.title}
                </strong>
              </header>
              <p className="avaliacoes__notice-text">{noticeDescription}</p>
            </aside>

            <Button
              fullWidth
              className="avaliacoes__close"
              disabled={!allPeersDone}
              onClick={() => setCycleClosed(true)}
            >
              <Lock size={18} /> {peers.closeLabel}
            </Button>

            {cycleClosed && (
              <p className="avaliacoes__feedback avaliacoes__feedback--success" role="status">
                {peers.closedFeedback}
              </p>
            )}
          </section>
        )}
      </PageShell>

    </>
  );
}
