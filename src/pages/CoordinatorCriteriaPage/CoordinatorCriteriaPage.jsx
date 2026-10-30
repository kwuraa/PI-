import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Select from '../../components/ui/Select/Select';
import { ArrowRight, Plus } from '../../components/icons';
import { criteriaService } from '../../services/criteriaService';
import './CoordinatorCriteriaPage.css';

/**
 * Tela "Critérios do curso" (/coordenador/criterios).
 * A coordenação define os critérios comuns e seus pesos (soma 100%).
 */
export default function CoordinatorCriteriaPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await criteriaService.getForCourse();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar os critérios.');
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
        <p className="coord-criteria__status" role="status">
          Carregando critérios…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p
          className="coord-criteria__status coord-criteria__status--error"
          role="alert"
        >
          {error || 'Não foi possível carregar os critérios.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, semester, section, criteria } = data;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="coord-criteria__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="coord-criteria__title">{header.title}</h1>
          <p className="coord-criteria__description">{header.description}</p>
        </section>

        <Select
          label={semester.label}
          options={semester.options}
          defaultValue={semester.value}
        />

        <section className="coord-criteria__section">
          <div className="coord-criteria__section-header">
            <h2 className="coord-criteria__heading">{section.title}</h2>
            <span className="coord-criteria__total">
              {section.totalLabel}
            </span>
          </div>

          {criteria.map((criterion) => (
            <article className="coord-criteria__card" key={criterion.id}>
              <header className="coord-criteria__card-header">
                <Badge tone="success">{criterion.badge}</Badge>
                <strong className="coord-criteria__weight">
                  {criterion.weight}
                </strong>
              </header>

              <h3 className="coord-criteria__card-title">{criterion.title}</h3>
              <p className="coord-criteria__card-meta">{criterion.meta}</p>

              <Link
                to={`/coordenador/criterios/${criterion.id}`}
                className="coord-criteria__action"
              >
                <span>{data.actionLabel}</span>
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </section>

        <Button
          fullWidth
          onClick={() => navigate('/coordenador/criterios/novo')}
        >
          <Plus size={18} /> {data.addLabel}
        </Button>

        <p className="coord-criteria__footer" id="coord-criteria__footer-note">
          {data.footer}
        </p>
      </PageShell>

    </>
  );
}
