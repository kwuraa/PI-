import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import FileCard from '../../components/ui/FileCard/FileCard';
import Checkbox from '../../components/ui/Checkbox/Checkbox';
import TextAreaField from '../../components/ui/TextAreaField/TextAreaField';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import { Check, MessageSquare } from '../../components/icons';
import { reviewService } from '../../services/reviewService';
import './ReviewProjectPage.css';

const DECISIONS = {
  approved: 'Parecer enviado: projeto aprovado e publicado.',
  changes: 'Parecer enviado: ajustes solicitados à equipe.',
};

/**
 * Tela "Revisar projeto" (/professor/revisar/:slug).
 * Critérios, parecer e decisão vivem em estado local — no back-end
 * futuro, o POST do parecer substituirá esses handlers.
 */
export default function ReviewProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [header, setHeader] = useState({ title: 'Revisar projeto' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [criteria, setCriteria] = useState({});
  const [opinion, setOpinion] = useState('');
  const [decision, setDecision] = useState('');

  useEffect(() => {
    let active = true;

    async function loadReview() {
      try {
        const data = await reviewService.get(slug);
        if (active) {
          setReview(data.review);
          setHeader(data.header);
          setOpinion(data.review.opinion.value);
          setCriteria(
            Object.fromEntries(
              data.review.criteria.items.map((item) => [item.id, item.checked])
            )
          );
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReview();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <div className="review__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="review__status" role="status">
            Carregando projeto para revisão…
          </p>
        </PageShell>
      </>
    );
  }

  if (error || !review) {
    return (
      <>
        <div className="review__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="review__status review__status--error" role="alert">
            {error || 'Não foi possível carregar o projeto.'}
          </p>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <div className="review__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <div className="review__status-row">
          <Badge tone={review.status.tone}>{review.status.label}</Badge>
          <span className="review__date">{review.date}</span>
        </div>

        <img
          className="review__cover"
          src={review.cover.url}
          alt={review.cover.alt}
          width={366}
          height={158}
        />

        <header className="review__header">
          <h1 className="review__title">{review.title}</h1>
          <p className="review__meta">{review.meta}</p>
          <p className="review__authors">{review.authors}</p>
          <p className="review__advisor">{review.advisor}</p>
        </header>

        <section className="review__section">
          <h2 className="review__heading">Resumo do projeto</h2>
          <p className="review__summary">{review.summary}</p>
        </section>

        <section className="review__section">
          <SectionHeader
            title="Materiais enviados"
            actionLabel={`${review.files.length} arquivos`}
          />
          <ul className="review__files">
            {review.files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        <section className="review__criteria">
          <h2 className="review__heading">{review.criteria.title}</h2>
          <ul className="review__criteria-list">
            {review.criteria.items.map((item) => (
              <Checkbox
                key={item.id}
                label={item.label}
                checked={criteria[item.id]}
                onChange={(checked) =>
                  setCriteria((current) => ({ ...current, [item.id]: checked }))
                }
              />
            ))}
          </ul>
        </section>

        <section className="review__section">
          <h2 className="review__heading">Seu parecer</h2>
          <TextAreaField
            label={
              review.opinion.required
                ? `${review.opinion.label} *`
                : review.opinion.label
            }
            value={opinion}
            onChange={(event) => setOpinion(event.target.value)}
            helper={review.opinion.helper}
          />
        </section>

        <AlertCard
          icon={review.alert.icon}
          title={review.alert.title}
          description={review.alert.description}
        />

        <div className="review__actions">
          <Button
            fullWidth
            onClick={() => {
              setDecision('approved');
              // No back-end real, POST da decisão redireciona ao resultado
              navigate(`/professor/revisar/${slug}/resultado`);
            }}
          >
            <Check size={18} /> {review.approveLabel}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setDecision('changes');
              navigate(`/professor/revisar/${slug}/resultado`);
            }}
          >
            <MessageSquare size={18} /> {review.requestChangesLabel}
          </Button>
        </div>

        <p className="review__footer" role={decision ? 'status' : undefined}>
          {decision ? DECISIONS[decision] : review.decisionFooter}
        </p>
      </PageShell>

    </>
  );
}
