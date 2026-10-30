import React, { useEffect, useState } from 'react';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import { Info, Lock } from '../../components/icons';
import { evaluationService } from '../../services/evaluationService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './CoordinatorPeerReviewsPage.css';

/**
 * Tela "Avaliação paritária entre coordenadores" (/coordenador/paritarias).
 * O ciclo só pode ser encerrado quando todos os pares concluírem —
 * a contagem e os textos são recalculados ao vivo.
 */
export default function CoordinatorPeerReviewsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await evaluationService.getPeerReviews();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o ciclo.');
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
        <p className="peer__status" role="status">
          Carregando ciclo…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="peer__status peer__status--error" role="alert">
          {error || 'Não foi possível carregar o ciclo.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, cycle, sectionTitle, participants, closeLabel, info } =
    data;

  const total = participants.length;
  const done = participants.filter((p) => p.status === 'done').length;
  const percent = Math.round((done / total) * 100);
  const allDone = done === total;

  /** Substitui os marcadores {done}/{total}/{percent}/{pending} do mock. */
  const fill = (template) =>
    template
      .replaceAll('{done}', String(done))
      .replaceAll('{total}', String(total))
      .replaceAll('{percent}', String(percent))
      .replaceAll('{pending}', String(total - done));

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="peer__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="peer__title">{header.title}</h1>
          <p className="peer__description">{header.description}</p>
        </section>

        <section className="peer__cycle">
          <header className="peer__cycle-header">
            <strong className="peer__cycle-title">{cycle.title}</strong>
            <Badge tone={cycle.statusBadge.tone}>{cycle.statusBadge.label}</Badge>
          </header>

          <p className="peer__cycle-label">{fill(cycle.progressLabel)}</p>

          <progress
            className="peer__cycle-progress"
            value={done}
            max={total}
            aria-label={fill(cycle.progressLabel)}
          />

          <p className="peer__cycle-caption">{fill(cycle.captionTemplate)}</p>
        </section>

        <section className="peer__section">
          <h2 className="peer__heading">{sectionTitle}</h2>

          {participants.map((person) => (
            <article className="peer__card" key={person.id}>
              <span className="peer__avatar" aria-hidden="true">
                {person.initials}
              </span>

              <span className="peer__text">
                <strong className="peer__name">{person.name}</strong>
                <span className="peer__course">{person.course}</span>
              </span>

              <Badge tone={person.status === 'done' ? 'success' : 'amber'}>
                {person.statusLabel}
              </Badge>
            </article>
          ))}
        </section>

        <Button
          fullWidth
          className="peer__close"
          disabled={!allDone}
          onClick={() => setClosed(true)}
        >
          <Lock size={18} /> {closeLabel}
        </Button>

        {closed && (
          <p className="peer__feedback" role="status">
            {data.closedFeedback}
          </p>
        )}

        <div className="peer__info">
          <span className="peer__info-icon" aria-hidden="true">
            <Info size={20} />
          </span>
          <span className="peer__info-body">
            <span className="peer__info-text">{info.text}</span>
            {/* O requisito é total/total: todas as avaliações do ciclo */}
            <strong className="peer__info-required">
              {info.requiredTemplate
                .replaceAll('{done}', String(total))
                .replaceAll('{total}', String(total))}
            </strong>
          </span>
        </div>
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
