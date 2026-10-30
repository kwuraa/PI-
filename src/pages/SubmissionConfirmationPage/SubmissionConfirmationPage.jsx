import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import AuthorRow from '../../components/ui/AuthorRow/AuthorRow';
import FileCard from '../../components/ui/FileCard/FileCard';
import { Send, Clock } from '../../components/icons';
import { studentService } from '../../services/studentService';
import './SubmissionConfirmationPage.css';

/**
 * Tela "Envio do projeto" (/meus-projetos/enviado).
 * Confirmação exibida após o aluno enviar o projeto para análise.
 */
export default function SubmissionConfirmationPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await studentService.getSubmissionConfirmation();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar a confirmação.');
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
        <p className="submission__status" role="status">
          Carregando…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="submission__status submission__status--error" role="alert">
          {error || 'Não foi possível carregar a confirmação.'}
        </p>
      </PageShell>
    );
  }

  const { header, project, notice, advisorSectionTitle, advisor, file, next } =
    data;

  return (
    <>
      <div className="submission__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="submission__hero">
          <span className="submission__hero-icon" aria-hidden="true">
            <Send size={28} />
          </span>
          <h1 className="submission__headline">{header.headline}</h1>
          <p className="submission__description">{header.description}</p>
        </section>

        <section className="submission__card">
          <Badge tone="amber">{project.statusBadge}</Badge>
          <h2 className="submission__title">{project.title}</h2>
          <p className="submission__meta">{project.meta}</p>
          <strong className="submission__authors">{project.authors}</strong>
          <p className="submission__sent">{project.sentLine}</p>
        </section>

        <AlertCard
          icon={notice.icon}
          tone={notice.tone}
          title={notice.title}
          description={notice.description}
        />

        <section className="submission__section">
          <h2 className="submission__heading">{advisorSectionTitle}</h2>
          <ul className="submission__people">
            <AuthorRow author={advisor} />
          </ul>
          <FileCard file={file} />
        </section>

        <section className="submission__section">
          <h2 className="submission__heading">{next.title}</h2>
          <p className="submission__text">{next.description}</p>
        </section>

        <div className="submission__actions">
          <Button fullWidth onClick={() => navigate(project.analysisHref)}>
            <Clock size={18} /> {next.primaryLabel}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/meus-projetos')}
          >
            {next.secondaryLabel}
          </Button>
        </div>
      </PageShell>

    </>
  );
}
