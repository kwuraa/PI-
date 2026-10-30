import React, { useEffect, useState } from 'react';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Select from '../../components/ui/Select/Select';
import { ChevronDown, ChevronUp } from '../../components/icons';
import { evaluationService } from '../../services/evaluationService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './CoordinatorTeacherEvaluationPage.css';

/**
 * Tela "Desempenho docente" (/coordenador/desempenho).
 * Accordeão: um professor é expandido por vez com nota + comentário.
 * A contagem de avaliados é recalculada a cada salvamento.
 */
export default function CoordinatorTeacherEvaluationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await evaluationService.getTeacherPerformance();
        if (active) {
          setData(response);
          setRows(response.teachers);
          // Abre o primeiro professor ainda pendente
          setExpandedId(
            response.teachers.find((teacher) => teacher.status === 'pending')
              ?.id ?? null
          );
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

  function updateRow(id, patch) {
    setRows((current) =>
      current.map((teacher) =>
        teacher.id === id ? { ...teacher, ...patch } : teacher
      )
    );
    setFeedback({ type: '', text: '' });
  }

  function handleSave(teacher) {
    const value = Number(String(teacher.score).replace(',', '.'));

    if (!(value >= 0 && value <= 10) || !teacher.comment.trim()) {
      setFeedback({ type: 'error', text: data.form.helper });
      return;
    }

    updateRow(teacher.id, { status: 'done' });
    setExpandedId(null);
    setFeedback({ type: 'success', text: data.form.savedFeedback });
  }

  if (loading) {
    return (
      <PageShell>
        <p className="teacher-eval__status" role="status">
          Carregando avaliações…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p
          className="teacher-eval__status teacher-eval__status--error"
          role="alert"
        >
          {error || 'Não foi possível carregar as avaliações.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, semester, sectionTitle, form } = data;

  const doneCount = rows.filter((teacher) => teacher.status === 'done').length;
  const countLabel = `${doneCount} de ${rows.length} ${
    doneCount === 1 ? 'avaliado' : 'avaliados'
  }`;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="teacher-eval__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="teacher-eval__title">{header.title}</h1>
          <p className="teacher-eval__description">{header.description}</p>
        </section>

        <Select
          label={semester.label}
          options={semester.options}
          defaultValue={semester.value}
        />

        <section className="teacher-eval__section">
          <div className="teacher-eval__section-header">
            <h2 className="teacher-eval__heading">{sectionTitle}</h2>
            <span className="teacher-eval__count">{countLabel}</span>
          </div>

          {rows.map((teacher) => {
            const expanded = expandedId === teacher.id;

            return (
              <article className="teacher-eval__card" key={teacher.id}>
                <button
                  type="button"
                  className="teacher-eval__header"
                  aria-expanded={expanded}
                  onClick={() => setExpandedId(expanded ? null : teacher.id)}
                >
                  <span className="teacher-eval__identity">
                    <span className="teacher-eval__avatar" aria-hidden="true">
                      {teacher.initials}
                    </span>
                    <span className="teacher-eval__text">
                      <strong className="teacher-eval__name">
                        {teacher.name}
                      </strong>
                      <span className="teacher-eval__discipline">
                        {teacher.discipline}
                      </span>
                    </span>
                  </span>

                  <span className="teacher-eval__header-end">
                    <Badge tone={teacher.status === 'done' ? 'success' : 'amber'}>
                      {teacher.status === 'done' ? 'Avaliado' : 'Pendente'}
                    </Badge>
                    <span className="teacher-eval__chevron" aria-hidden="true">
                      {expanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </span>
                </button>

                {expanded && (
                  <div className="teacher-eval__form">
                    <h3 className="teacher-eval__form-title">{form.title}</h3>

                    <label
                      className="teacher-eval__label"
                      htmlFor={`score-${teacher.id}`}
                    >
                      {form.scoreLabel} *
                    </label>
                    <div className="teacher-eval__score-control">
                      <input
                        id={`score-${teacher.id}`}
                        type="text"
                        inputMode="decimal"
                        className="teacher-eval__score"
                        value={teacher.score}
                        onChange={(event) =>
                          updateRow(teacher.id, { score: event.target.value })
                        }
                      />
                      <span className="teacher-eval__score-suffix">
                        {form.scoreSuffix}
                      </span>
                    </div>

                    <label
                      className="teacher-eval__label"
                      htmlFor={`comment-${teacher.id}`}
                    >
                      {form.commentLabel} *
                    </label>
                    <textarea
                      id={`comment-${teacher.id}`}
                      className="teacher-eval__comment"
                      rows={4}
                      value={teacher.comment}
                      onChange={(event) =>
                        updateRow(teacher.id, { comment: event.target.value })
                      }
                    />

                    <p className="teacher-eval__helper">{form.helper}</p>

                    <Button fullWidth onClick={() => handleSave(teacher)}>
                      {form.saveLabel}
                    </Button>

                    {feedback.text && (
                      <p
                        className={`teacher-eval__feedback teacher-eval__feedback--${feedback.type}`}
                        role="status"
                      >
                        {feedback.text}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
