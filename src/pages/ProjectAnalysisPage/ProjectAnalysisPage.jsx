import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import Timeline from '../../components/ui/Timeline/Timeline';
import AuthorRow from '../../components/ui/AuthorRow/AuthorRow';
import { studentService } from '../../services/studentService';
import './ProjectAnalysisPage.css';

/**
 * Tela "Acompanhar análise" (/meus-projetos/:slug/analise).
 * O aluno acompanha as etapas do envio até a decisão do orientador.
 */
export default function ProjectAnalysisPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await studentService.getProjectAnalysis(slug);
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar a análise.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <p className="analysis__status" role="status">
          Carregando análise…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="analysis__status analysis__status--error" role="alert">
          {error || 'Não foi possível carregar a análise.'}
        </p>
      </PageShell>
    );
  }

  const { header, alert, stepsSectionTitle, steps, peopleSectionTitle, people, review } =
    data;

  return (
    <>
      <div className="analysis__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="analysis__intro">
          <Badge tone="amber">{header.badge}</Badge>
          <h1 className="analysis__headline">{header.headline}</h1>
          <p className="analysis__meta">{header.meta}</p>
        </section>

        <AlertCard
          icon={alert.icon}
          tone={alert.tone}
          title={alert.title}
          description={alert.description}
        />

        <section className="analysis__section">
          <h2 className="analysis__heading">{stepsSectionTitle}</h2>
          <Timeline steps={steps} />
        </section>

        <section className="analysis__section">
          <h2 className="analysis__heading">{peopleSectionTitle}</h2>
          <ul className="analysis__people">
            {people.map((person) => (
              <AuthorRow key={person.id} author={person} />
            ))}
          </ul>
        </section>

        <section className="analysis__review">
          <strong className="analysis__review-title">{review.title}</strong>
          <p className="analysis__review-text">{review.description}</p>
        </section>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/meus-projetos')}
        >
          {data.backLabel}
        </Button>
      </PageShell>

    </>
  );
}
