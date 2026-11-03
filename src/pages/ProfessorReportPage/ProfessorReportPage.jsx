import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Select from '../../components/ui/Select/Select';
import { ArrowLeft, BarChart3, Lock, Download } from '../../components/icons';
import { reportService } from '../../services/reportService';
import './ProfessorReportPage.css';

/** Formata número no padrão pt-BR com 1 casa decimal: 6.7 → "6,7". */
const formatScore = (value) => value.toFixed(1).replace('.', ',');

/**
 * Tela "Relatório por turma" (/professor/relatorio).
 * Médias, aprovações e travas de disciplinas CHAVE da coorte.
 */
export default function ProfessorReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await reportService.getClassReport();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o relatório.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="report__status" role="status">
          Carregando relatório…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="report__status report__status--error" role="alert">
          {error || 'Não foi possível carregar o relatório.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, cohort, summary, averages, keySubjects } = data;

  // Média da turma: soma arredondada antes da divisão (evita erro binário)
  const sum = averages.students.reduce((total, s) => total + s.average, 0);
  const roundedSum = Math.round(sum * 10) / 10;
  const roomAverage =
    Math.round((roundedSum / averages.students.length) * 10) / 10;

  const approved = averages.students.filter((s) => s.average >= 6).length;
  const failed = averages.students.length - approved;
  const percentOf = (count) =>
    `${Math.round((count / averages.students.length) * 100)}% da turma`;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="report__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="report__intro">
          <h1 className="report__title">{header.title}</h1>
          <p className="report__description">{header.description}</p>
        </section>

        <section className="report__card">
          <strong className="report__card-label">{cohort.label}</strong>
          <Select
            options={cohort.options}
            defaultValue={cohort.value}
          />
          <strong className="report__card-course">{cohort.course}</strong>
          <p className="report__card-meta">{cohort.meta}</p>
        </section>

        <section className="report__section">
          <h2 className="report__heading">{summary.sectionTitle}</h2>

          <article className="report__summary">
            <header className="report__summary-header">
              <strong className="report__summary-value">
                {formatScore(roomAverage)}
              </strong>
              <span className="report__summary-icon" aria-hidden="true">
                <BarChart3 size={22} />
              </span>
            </header>
            <p className="report__summary-label">{summary.averageLabel}</p>
            <p className="report__summary-meta">{summary.meta}</p>
          </article>

          <div className="report__stats">
            <article className="report__stat">
              <strong className="report__stat-value">
                {summary.approved.value}
              </strong>
              <span className="report__stat-label report__stat-label--success">
                {summary.approved.label}
              </span>
              <span className="report__stat-caption">
                {percentOf(approved)}
              </span>
            </article>

            <article className="report__stat">
              <strong className="report__stat-value">
                {summary.failed.value}
              </strong>
              <span className="report__stat-label report__stat-label--primary">
                {summary.failed.label}
              </span>
              <span className="report__stat-caption">{percentOf(failed)}</span>
            </article>
          </div>

          <p className="report__helper">{summary.helper}</p>
        </section>

        <section className="report__section">
          <h2 className="report__heading">{averages.sectionTitle}</h2>

          <div className="report__averages">
            {averages.students.map((student) => (
              <div className="report__average-row" key={student.id}>
                <span className="report__average-name">{student.name}</span>
                <progress
                  className="report__average-progress"
                  value={student.average}
                  max={10}
                  aria-label={`Média ${formatScore(student.average)} de ${student.name}`}
                />
                <strong className="report__average-value">
                  {formatScore(student.average)}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="report__section">
          <h2 className="report__heading">{keySubjects.sectionTitle}</h2>

          <div className="report__alert">
            <strong className="report__alert-count">
              {keySubjects.alert.countLabel}
            </strong>
            <strong className="report__alert-title">
              {keySubjects.alert.title}
            </strong>
            <p className="report__alert-text">
              {keySubjects.alert.description}
            </p>
          </div>

          {keySubjects.items.map((item) => (
            <article className="report__key" key={item.id}>
              <header className="report__key-header">
                <Badge tone="primary">{item.badge}</Badge>
                <span className="report__key-icon" aria-hidden="true">
                  <Lock size={20} />
                </span>
              </header>
              <h3 className="report__key-title">{item.title}</h3>
              <p className="report__key-meta">{item.meta}</p>
              <p className="report__key-text">{item.description}</p>
            </article>
          ))}
        </section>

        <Button variant="secondary" fullWidth>
          <Download size={18} /> {data.exportLabel}
        </Button>

        <p className="report__footer">{data.footer}</p>
      </PageShell>

    </>
  );
}
