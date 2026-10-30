import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';
import Select from '../../components/ui/Select/Select';
import ScoreInput from '../../components/ui/ScoreInput/ScoreInput';
import { ArrowLeft, Check } from '../../components/icons';
import { classNotesService } from '../../services/classNotesService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './ProfessorGradesPage.css';

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
 * Tela "Notas da sala" — versão professor (/professor/notas).
 * Média ponderada (0,4 / 0,3 / 0,3) calculada ao vivo a partir dos campos.
 */
export default function ProfessorGradesPage() {
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
        const response = await classNotesService.getForProfessor();
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
        <p className="grades__status" role="status">
          Carregando notas…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="grades__status grades__status--error" role="alert">
          {error || 'Não foi possível carregar as notas.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, selector, formula, criteria, section } = data;

  /** Média ponderada de um aluno (pesos vêm do mock). */
  const averageOf = (student) =>
    criteria.reduce(
      (total, criterion) =>
        total + parseScore(student.scores[criterion.id]) * criterion.factor,
      0
    );

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="grades__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="grades__intro">
          <h1 className="grades__title">{header.title}</h1>
          <p className="grades__description">{header.description}</p>
        </section>

        <section className="grades__card">
          <h2 className="grades__card-title">{selector.title}</h2>
          <div className="grades__selector-row">
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
          <p className="grades__helper">{selector.meta}</p>
        </section>

        <aside className="grades__formula">
          <strong className="grades__formula-title">{formula.title}</strong>
          <p className="grades__formula-text">{formula.description}</p>
        </aside>

        <section className="grades__section">
          <div className="grades__section-header">
            <h2 className="grades__section-title">{section.title}</h2>
            <span className="grades__section-count">{rows.length} alunos</span>
          </div>

          {rows.map((student) => {
            const average = averageOf(student);
            return (
              <article className="grades__student" key={student.id}>
                <header className="grades__student-header">
                  <div className="grades__student-identity">
                    <strong className="grades__student-name">{student.name}</strong>
                    <span className="grades__student-ra">{student.ra}</span>
                  </div>
                  <Badge tone={average >= 6 ? 'success' : 'amber'}>
                    Média {formatScore(average)}
                  </Badge>
                </header>

                {criteria.map((criterion) => (
                  <div className="grades__score-row" key={criterion.id}>
                    <span className="grades__score-label">
                      {criterion.label} · {criterion.weight}
                    </span>
                    <ScoreInput
                      value={student.scores[criterion.id]}
                      label={`${criterion.label} de ${student.name}`}
                      onChange={(raw) => updateScore(student.id, criterion.id, raw)}
                    />
                  </div>
                ))}

                <label className="grades__notes-label" htmlFor={`notes-${student.id}`}>
                  Observações
                </label>
                <input
                  id={`notes-${student.id}`}
                  type="text"
                  className="grades__notes"
                  value={student.notes}
                  onChange={(event) => updateNotes(student.id, event.target.value)}
                />
              </article>
            );
          })}
        </section>

        <div className="grades__actions">
          {dirty && <Badge tone="amber">{data.pendingBadge}</Badge>}
          <Button fullWidth onClick={handleSave}>
            <Check size={18} /> {data.saveLabel}
          </Button>
        </div>

        <p className="grades__footer" role="status">
          {saved ? data.savedFeedback : data.footer}
        </p>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
