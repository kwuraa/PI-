import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Select from '../../components/ui/Select/Select';
import { ArrowLeft, Download, GraduationCap, Printer, TrendingUp } from '../../components/icons';
import { reportService } from '../../services/reportService';
import './CoordinatorConsolidatedReportPage.css';

/** Formata no padrão pt-BR: 7.75 → "7,75" (2 casas) e 1.5 → "1,5" (1 casa). */
const format2 = (value) => value.toFixed(2).replace('.', ',');
const format1 = (value) => value.toFixed(1).replace('.', ',');

/* Geometria fixa do gráfico (viewBox) — os dados entram como atributos,
   nunca como style inline, mantendo o CSS como única fonte de estilo. */
const CHART = {
  width: 320,
  top: 16,
  baseline: 160,
  left: 30,
  right: 312,
  barWidth: 38,
  radius: 6,
};
CHART.height = CHART.baseline - CHART.top;
CHART.slot = (CHART.right - CHART.left) / 4;

/** Caminho de uma barra com cantos superiores arredondados. */
function barPath(x, height) {
  const { baseline: b, radius: r } = CHART;
  const top = b - height;
  return [
    `M ${x} ${b}`,
    `L ${x} ${top + r}`,
    `Q ${x} ${top} ${x + r} ${top}`,
    `L ${x + CHART.barWidth - r} ${top}`,
    `Q ${x + CHART.barWidth} ${top} ${x + CHART.barWidth} ${top + r}`,
    `L ${x + CHART.barWidth} ${b}`,
    'Z',
  ].join(' ');
}

/**
 * Tela "Relatório consolidado" (/coordenador/relatorio).
 * Média geral, evolução por semestre (gráfico SVG), travas de
 * disciplinas CHAVE, bancas e entregáveis da coorte.
 */
export default function CoordinatorConsolidatedReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await reportService.getConsolidated();
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
        <p className="consolidated__status" role="status">
          Carregando relatório…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="consolidated__status consolidated__status--error" role="alert">
          {error || 'Não foi possível carregar o relatório.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, cohort, stats, chart, locks, boards, actions, footer } = data;

  const values = chart.semesters.map((semester) => semester.average);

  // Média geral: arredonda a soma antes de dividir (evita erro de ponto flutuante)
  const sum = values.reduce((total, value) => total + value, 0);
  const roundedSum = Math.round(sum * 10) / 10;
  const generalAverage = roundedSum / values.length;

  // Delta: último semestre menos o primeiro (8,5 − 7,0 = +1,5)
  const delta = values[values.length - 1] - values[0];
  const deltaLabel = `${delta >= 0 ? '+' : ''}${format1(delta)}`;

  const caption = chart.captionTemplate
    .replace('{values}', values.map(format1).join(' + '))
    .replace('{count}', String(values.length));

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="consolidated__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="consolidated__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="consolidated__title">{header.title}</h1>
          <p className="consolidated__description">{header.description}</p>
        </section>

        <section className="consolidated__cohort">
          <strong className="consolidated__cohort-label">{cohort.label}</strong>
          <Select options={cohort.options} defaultValue={cohort.value} />
          <p className="consolidated__cohort-meta">{cohort.meta}</p>
        </section>

        {/* Cartões de estatística */}
        <div className="consolidated__stats">
          <article className="consolidated__stat consolidated__stat--filled">
            <span className="consolidated__stat-icon" aria-hidden="true">
              <GraduationCap size={22} />
            </span>
            <strong className="consolidated__stat-value">
              {format2(generalAverage)}
            </strong>
            <span className="consolidated__stat-label">{stats.averageLabel}</span>
          </article>

          <article className="consolidated__stat">
            <span className="consolidated__stat-icon" aria-hidden="true">
              <TrendingUp size={22} />
            </span>
            <strong className="consolidated__stat-value">{deltaLabel}</strong>
            <span className="consolidated__stat-label">{stats.deltaLabel}</span>
          </article>
        </div>

        {/* Gráfico de evolução por semestre (SVG) */}
        <section className="consolidated__card">
          <h2 className="consolidated__card-title">{chart.sectionTitle}</h2>
          <p className="consolidated__card-subtitle">{chart.subtitle}</p>

          <svg
            className="consolidated__chart"
            viewBox={`0 0 ${CHART.width} 200`}
            role="img"
            aria-label={caption}
          >
            <text className="consolidated__chart-axis" x="10" y={CHART.top + 6}>
              {chart.axisTop}
            </text>
            <text className="consolidated__chart-axis" x="14" y={CHART.baseline + 4}>
              {chart.axisBottom}
            </text>

            {chart.semesters.map((semester, index) => {
              const center =
                CHART.left + CHART.slot * index + CHART.slot / 2;
              const x = center - CHART.barWidth / 2;
              const height = (semester.average / 10) * CHART.height;
              const isCurrent = index === chart.semesters.length - 1;

              return (
                <g key={semester.id}>
                  <path
                    className={`consolidated__chart-bar ${
                      isCurrent ? 'consolidated__chart-bar--current' : ''
                    }`}
                    d={barPath(x, height)}
                  />
                  <text
                    className="consolidated__chart-value"
                    x={center}
                    y={CHART.baseline - height - 10}
                    textAnchor="middle"
                  >
                    {format1(semester.average)}
                  </text>
                  <text
                    className="consolidated__chart-semester"
                    x={center}
                    y={CHART.baseline + 24}
                    textAnchor="middle"
                  >
                    {semester.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="consolidated__chart-caption">{caption}</p>
        </section>

        {/* Travas de disciplinas CHAVE */}
        <section className="consolidated__card">
          <header className="consolidated__card-header">
            <h2 className="consolidated__card-title">{locks.title}</h2>
            <Badge>{locks.badge}</Badge>
          </header>

          <p className="consolidated__locks-description">{locks.description}</p>

          <div className="consolidated__locks-list">
            {locks.items.map((item) => (
              <div className="consolidated__lock-row" key={item.id}>
                <strong className="consolidated__lock-name">{item.name}</strong>
                <Badge>{item.studentsLabel}</Badge>
              </div>
            ))}
          </div>

          <Link to={locks.actionHref} className="consolidated__locks-action">
            {locks.actionLabel} →
          </Link>
        </section>

        {/* Bancas e entregáveis */}
        <section className="consolidated__section">
          <h2 className="consolidated__section-title">{boards.sectionTitle}</h2>

          <div className="consolidated__card consolidated__boards">
            {boards.rows.map((row, index) => (
              <div
                className={`consolidated__board ${
                  index > 0 ? 'consolidated__board--divided' : ''
                }`}
                key={row.id}
              >
                <header className="consolidated__board-header">
                  <strong className="consolidated__board-title">{row.title}</strong>
                  <Badge tone={row.badge.tone}>{row.badge.label}</Badge>
                </header>
                <p className="consolidated__board-meta">{row.meta}</p>
              </div>
            ))}
          </div>
        </section>

        <Button fullWidth onClick={() => window.print()}>
          <Download size={18} /> {actions.exportLabel}
        </Button>

        <Button variant="secondary" fullWidth onClick={() => window.print()}>
          <Printer size={18} /> {actions.printLabel}
        </Button>

        <p className="consolidated__footer">{footer}</p>
      </PageShell>

    </>
  );
}
