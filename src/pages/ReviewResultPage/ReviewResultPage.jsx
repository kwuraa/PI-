import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import AuthorRow from '../../components/ui/AuthorRow/AuthorRow';
import FileCard from '../../components/ui/FileCard/FileCard';
import {
  CheckCircle2,
  GitBranch,
  PencilLine,
  History,
  ArrowRight,
} from '../../components/icons';
import { reviewService } from '../../services/reviewService';
import './ReviewResultPage.css';

const HERO_ICONS = {
  check: CheckCircle2,
  'git-branch': GitBranch,
};

/**
 * Tela "Resultado da revisão" (/professor/revisar/:slug/resultado).
 * Exibida após o professor registrar a decisão:
 *  - variante aprovado  → projeto publicado + parecer de aprovação;
 *  - variante ajustes   → itens a revisar + aguardando reenvio.
 */
export default function ReviewResultPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await reviewService.getResult(slug);
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o resultado.');
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
      <>
        <div className="result__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="result__status" role="status">
            Carregando resultado…
          </p>
        </PageShell>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <div className="result__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="result__status result__status--error" role="alert">
            {error || 'Não foi possível carregar o resultado.'}
          </p>
        </PageShell>
      </>
    );
  }

  const { header, topNotice, project, review, filesSection, notice, actions } =
    data;
  const HeroIcon = HERO_ICONS[header.hero.icon] || CheckCircle2;

  return (
    <>
      <div className="result__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="result__intro">
          <Badge tone="neutral">{header.destinationBadge}</Badge>

          <span
            className={`result__hero-icon result__hero-icon--${header.hero.tone}`}
            aria-hidden="true"
          >
            <HeroIcon size={26} />
          </span>

          <h1 className="result__headline">{header.headline}</h1>
          <p className="result__description">{header.description}</p>
        </section>

        {topNotice && (
          <AlertCard
            icon={topNotice.icon}
            tone={topNotice.tone}
            title={topNotice.title}
            description={topNotice.description}
          />
        )}

        {project.heroImage && (
          <img
            className="result__hero-image"
            src={project.heroImage}
            alt=""
          />
        )}

        <section className="result__project">
          <Badge tone={project.statusBadge.tone}>
            {project.statusBadge.label}
          </Badge>
          <h2 className="result__title">{project.title}</h2>
          <p className="result__meta">{project.meta}</p>
          <strong className="result__authors">{project.authors}</strong>
          <p className="result__dates">{project.datesLine}</p>
        </section>

        <section className="result__section">
          <h2 className="result__heading">{review.sectionTitle}</h2>

          <article className="result__review">
            <ul className="result__review-authors">
              <AuthorRow author={review.author} />
            </ul>

            <p className="result__review-text">{review.text}</p>

            {review.items.length > 0 && (
              <ul className="result__review-items">
                {review.items.map((item) => (
                  <li className="result__item" key={item.title}>
                    <span className="result__item-icon" aria-hidden="true">
                      <PencilLine size={16} />
                    </span>
                    <span className="result__item-body">
                      <strong className="result__item-title">{item.title}</strong>
                      <span className="result__item-description">
                        {item.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {review.decisionBadge && (
              <Badge tone={review.decisionBadge.tone}>
                {review.decisionBadge.label}
              </Badge>
            )}
          </article>
        </section>

        <section className="result__section">
          <h2 className="result__heading">{filesSection.title}</h2>
          <ul className="result__files">
            {filesSection.items.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        <AlertCard
          icon={notice.icon}
          tone={notice.tone}
          title={notice.title}
          description={notice.description}
        />

        <div className="result__actions">
          <Button fullWidth onClick={() => navigate(actions.primary.href)}>
            {actions.primary.icon === 'arrow' && <ArrowRight size={18} />}
            {actions.primary.label}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate(actions.secondary.href)}
          >
            {actions.secondary.icon === 'history' && <History size={18} />}
            {actions.secondary.label}
          </Button>
        </div>
      </PageShell>

    </>
  );
}
