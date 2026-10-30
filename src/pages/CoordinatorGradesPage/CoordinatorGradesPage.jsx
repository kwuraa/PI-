import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';
import Select from '../../components/ui/Select/Select';
import ScoreInput from '../../components/ui/ScoreInput/ScoreInput';
import { ArrowLeft, Check, ShieldCheck, PencilLine } from '../../components/icons';
import { classNotesService } from '../../services/classNotesService';
import './CoordinatorGradesPage.css';

/** Formata número no padrão pt-BR: 8.3 → "8,3". */
const formatScore = (value) => value.toFixed(1).replace('.', ',');

/** Converte texto digitado ("8,3") em número (8.3). */
const parseScore = (text) => Number(String(text).replace(',', '.'));

/** Valor inicial de cada critério já no formato pt-BR. */
const initialScores = (student) =>
  Object.fromEntries(
    Object.entries(student.scores).map(([key, value]) => [key, formatScore(value)])
  );

/**
 * Tela "Notas da sala" — versão coordenador (/coordenador/notas).
 * Média simples dos três critérios; a coordenação edita qualquer sala.
 */
export default function CoordinatorGradesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await classNotesService.getForCoordinator();
        if (active) {
          setData(response);
          setRows(
            response.students.map((student) => ({
              ...student,
              scores: initialScores(student),
            }))
          );
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar as notas.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  function updateScore(studentId, criterion, raw) {
    setRows((current) =>
      current.map((student) =>
        student.id === studentId
          ? { ...student, scores: { ...student.scores, [criterion]: raw } }
          : student
      )
    );
    setDirty(true);
    setSaved(false);
  }

  function updateNotes(studentId, value) {
    setRows((current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, notes: value } : student
      )
    );
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    setDirty(false);
    setSaved(true);
  }

  if (loading) {
    return (
      <PageShell>
        <p className="coord-grades__status" role="status">
          Carregando notas…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="coord-grades__status coord-grades__status--error" role="alert">
          {error || 'Não foi possível carregar as notas.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, selector, section, criteria } = data;

  /** Média simples de um aluno. */
  const averageOf = (student) =>
    criteria.reduce(
      (total, criterion) => total + parseScore(student.scores[criterion.id]),
      0
    ) / criteria.length;

  /** Média da sala (média das médias dos alunos). */
  const roomAverage =
    rows.reduce((total, student) => total + averageOf(student), 0) / rows.length;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="coord-grades__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="coord-grades__intro">
          <Badge tone="primary">{header.badge}</Badge>
          <h1 className="coord-grades__title">{header.title}</h1>
          <p className="coord-grades__description">{header.description}</p>
        </section>

        <section className="coord-grades__card">
          <p className="coord-grades__notice">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>{selector.editNotice.label}</span>
          </p>

          <div className="coord-grades__selector-row">
            <Select
              label={selector.semester.label}
              options={selector.semester.options}
              defaultValue={selector.semester.value}
            />
            <Select
              label={selector.room.label}
              options={selector.room.options}
              defaultValue={selector.room.value}
            />
          </div>
          <Select
            label={selector.discipline.label}
            options={selector.discipline.options}
            defaultValue={selector.discipline.value}
          />
        </section>

        <section className="coord-grades__section">
          <div className="coord-grades__section-header">
            <h2 className="coord-grades__section-title">{rows.length} alunos</h2>
            <span className="coord-grades__room-average">
              {section.averageLabel}: {formatScore(roomAverage)}
            </span>
          </div>

          <p className="coord-grades__note">{section.note}</p>

          {rows.map((student) => {
            const average = averageOf(student);
            return (
              <article className="coord-grades__student" key={student.id}>
                <header className="coord-grades__student-header">
                  <div className="coord-grades__student-identity">
                    <strong className="coord-grades__student-name">
                      {student.name}
                    </strong>
                    <span className="coord-grades__student-project">
                      {student.project}
                    </span>
                  </div>
                  <Badge tone={average >= 6 ? 'success' : 'amber'}>
                    Média {formatScore(average)}
                  </Badge>
                </header>

                <div className="coord-grades__score-grid">
                  {criteria.map((criterion) => (
                    <label
                      className="coord-grades__score-cell"
                      key={criterion.id}
                      htmlFor={`${student.id}-${criterion.id}`}
                    >
                      <span className="coord-grades__score-label">
                        {criterion.label}
                      </span>
                      <ScoreInput
                        id={`${student.id}-${criterion.id}`}
                        value={student.scores[criterion.id]}
                        label={`${criterion.label} de ${student.name}`}
                        className="coord-grades__score-input"
                        onChange={(raw) => updateScore(student.id, criterion.id, raw)}
                      />
                    </label>
                  ))}
                </div>

                <label
                  className="coord-grades__notes-label"
                  htmlFor={`notes-${student.id}`}
                >
                  Observações
                </label>
                <div className="coord-grades__notes-control">
                  <input
                    id={`notes-${student.id}`}
                    type="text"
                    className="coord-grades__notes"
                    value={student.notes}
                    onChange={(event) => updateNotes(student.id, event.target.value)}
                  />
                  <span
                    className="coord-grades__notes-icon"
                    aria-hidden="true"
                  >
                    <PencilLine size={18} />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <div className="coord-grades__actions">
          {dirty && <Badge tone="amber">{data.pendingBadge}</Badge>}
          <Button fullWidth onClick={handleSave}>
            <Check size={18} /> {data.saveLabel}
          </Button>
        </div>

        <p className="coord-grades__footer" role="status">
          {saved ? data.savedFeedback : data.footer}
        </p>
      </PageShell>

    </>
  );
}
