/**
 * PI² — Status da análise do projeto (rota "/aluno/status/:slug").
 * -----------------------------------------------------------------------------
 * "EcoCampus/Biblioteca enviado para análise" + "Análise de Biblioteca
 * Conectada": mostra o banner de envio (quando ?enviado=1), o resumo do
 * projeto e a linha do tempo QUALITATIVA das etapas (sem notas numéricas).
 */
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiCheck, FiClock, FiCircle } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Avatar from '../../components/ui/Avatar/Avatar.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  ANALYSIS_STEPS,
  ANALYSIS_WATCHERS,
  getProjectBySlug,
} from '../../mocks/projectsMock.js';
import styles from './ProjectStatusPage.module.css';

/** Ícone de cada estado da etapa. */
const STEP_ICONS = {
  done: FiCheck,
  current: FiClock,
  todo: FiCircle,
};

export default function ProjectStatusPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const justSent = searchParams.get('enviado') === '1';
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className={styles.page}>
        <Callout tone="danger" title="Projeto não encontrado">
          <Link to="/aluno">Voltar para meus projetos</Link>
        </Callout>
      </div>
    );
  }

  const status = statusMeta(project.status);

  return (
    <div className={styles.page}>
      {justSent && (
        <Callout
          tone="success"
          icon={<FiCheck size={22} aria-hidden="true" />}
          title="Projeto enviado para análise!"
        >
          Sua equipe enviou os links da entrega. O orientador foi notificado e
          registrará um parecer. Você acompanha cada etapa abaixo.
        </Callout>
      )}

      {/* -------------------------------------------- resumo */}
      <Card padding="md" className={styles.summary}>
        <div className={styles.summaryTop}>
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className={styles.summaryMeta}>
            Enviado em {project.submittedAt}
          </span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
      </Card>

      {/* ---------------------------------------- linha do tempo */}
      <section className={styles.block}>
        <SectionHeader title="Acompanhamento da análise" />
        <ol className={styles.timeline}>
          {ANALYSIS_STEPS.map((step) => {
            const Icon = STEP_ICONS[step.state];
            return (
              <li key={step.id} className={`${styles.step} ${styles[step.state]}`}>
                <span className={styles.stepIcon}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <div className={styles.stepBody}>
                  <strong className={styles.stepTitle}>{step.title}</strong>
                  <span className={styles.stepMeta}>{step.meta}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------------------------------------- quem acompanha */}
      <section className={styles.block}>
        <SectionHeader title="Quem acompanha" />
        <ul className={styles.watchers}>
          {ANALYSIS_WATCHERS.map((person) => (
            <li key={person.id} className={styles.watcher}>
              <Avatar
                initials={person.initials}
                tone={person.tone === 'primary' ? 'primary' : 'neutral'}
                size="sm"
              />
              <div className={styles.watcherTexts}>
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/aluno" className={styles.backLink}>
        Voltar para meus projetos
      </Link>
    </div>
  );
}
