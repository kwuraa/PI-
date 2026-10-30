import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import FileCard from '../../components/ui/FileCard/FileCard';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import {
  Check,
  Clock,
  CheckCircle2,
  ExternalLink,
  ClipboardCheck,
} from '../../components/icons';
import { submissionsService } from '../../services/submissionsService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './ProfessorDeliveryPage.css';

/**
 * Tela "Detalhe da entrega" (/professor/entregas/:slug).
 * Variante aprovada: materiais, versão navegável e revisão concluída.
 * Variante pendente: botão para iniciar a revisão.
 */
export default function ProfessorDeliveryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await submissionsService.getDelivery(slug);
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar a entrega.');
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
        <p className="delivery__status" role="status">
          Carregando entrega…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="delivery__status delivery__status--error" role="alert">
          {error || 'Não foi possível carregar a entrega.'}
        </p>
      </PageShell>
    );
  }

  const { header, project, about, materials, external, review } = data;

  return (
    <>
      <div className="delivery__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="delivery__header">
          <Badge>{header.badge}</Badge>
          <span className="delivery__status-line">{header.statusLine}</span>
        </section>

        {project.heroImage && (
          <img
            className="delivery__hero-image"
            src={project.heroImage}
            alt=""
          />
        )}

        <section className="delivery__project">
          <div className="delivery__badges">
            <Badge>{project.courseBadge}</Badge>
            <Badge tone={project.statusBadge.tone}>
              {project.statusBadge.label}
            </Badge>
          </div>

          <h1 className="delivery__title">{project.title}</h1>
          <p className="delivery__meta">{project.meta}</p>
          <p className="delivery__meta">{project.publishedLine}</p>
          <strong className="delivery__authors">{project.authors}</strong>
          <p className="delivery__advisor">{project.advisor}</p>
        </section>

        <section className="delivery__section">
          <h2 className="delivery__heading">{about.title}</h2>
          <p className="delivery__text">{about.description}</p>
          <ul className="delivery__tags">
            {about.tags.map((tag) => (
              <li className="delivery__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section className="delivery__section">
          <SectionHeader
            title={materials.title}
            actionLabel={materials.actionLabel}
          />
          <ul className="delivery__files">
            {materials.items.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        {external && (
          <section className="delivery__external">
            <header className="delivery__external-header">
              <span className="delivery__external-icon" aria-hidden="true">
                <ExternalLink size={20} />
              </span>
              <span className="delivery__external-text">
                <strong className="delivery__external-title">
                  {external.title}
                </strong>
                <span className="delivery__external-description">
                  {external.description}
                </span>
              </span>
            </header>
            <p className="delivery__external-url">{external.url}</p>
            <Button
              fullWidth
              onClick={() => navigate(`/projetos/${slug}`)}
            >
              <ExternalLink size={18} /> {external.actionLabel}
            </Button>
          </section>
        )}

        <article
          className={`delivery__review ${
            review.pending ? 'delivery__review--pending' : ''
          }`}
        >
          <header className="delivery__review-header">
            <strong className="delivery__review-title">{review.title}</strong>
            {review.pending ? (
              <span className="delivery__review-icon delivery__review-icon--amber" aria-hidden="true">
                <Clock size={20} />
              </span>
            ) : (
              <span className="delivery__review-icon delivery__review-icon--success" aria-hidden="true">
                <CheckCircle2 size={20} />
              </span>
            )}
          </header>

          <p className="delivery__review-text">{review.text}</p>

          {review.checks.length > 0 && (
            <ul className="delivery__checks">
              {review.checks.map((check) => (
                <li className="delivery__check" key={check}>
                  <span className="delivery__check-icon" aria-hidden="true">
                    <Check size={12} />
                  </span>
                  <span className="delivery__check-label">{check}</span>
                </li>
              ))}
            </ul>
          )}

          {review.pending && (
            <Button
              fullWidth
              onClick={() => navigate(review.actionHref)}
            >
              {review.actionLabel}
            </Button>
          )}
        </article>

        {!review.pending && (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate(review.historyHref)}
          >
            <ClipboardCheck size={18} /> {review.historyLabel}
          </Button>
        )}

        <p className="delivery__footer">{data.footer}</p>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
