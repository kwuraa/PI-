/**
 * PI² — Resultado da revisão (rota "/painel/resultado/:slug").
 * -----------------------------------------------------------------------------
 * Duas decisões do professor (como nos protótipos):
 *  • padrão              → "AquaSense aprovado e publicado";
 *  • ?decisao=ajustes    → "AquaSense com ajustes solicitados".
 * Mostra o resumo do projeto, a checklist conferida e os próximos passos.
 */
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { getProjectBySlug, getTeam } from '../../mocks/projectsMock.js';
import styles from './ReviewResultPage.module.css';

const APPROVED_MESSAGE =
  'Projeto consistente, com entrega completa e links acessíveis. Recomendo a publicação no repositório acadêmico.';

const ADJUST_MESSAGE =
  'Os links foram recebidos, mas o relatório precisa de ajustes antes da publicação. Reenvie a versão revisada com as correções apontadas pelo orientador.';

export default function ReviewResultPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const wantsAdjust = searchParams.get('decisao') === 'ajustes';
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className={styles.page}>
        <Callout tone="danger" title="Projeto não encontrado">
          <Link to="/painel">Voltar ao painel</Link>
        </Callout>
      </div>
    );
  }

  const team = getTeam(project);
  const approved = !wantsAdjust;
  const message = wantsAdjust
    ? ADJUST_MESSAGE
    : project.review?.comment ?? APPROVED_MESSAGE;
  const criteria = project.review?.criteria ?? [
    'Dados e autoria conferidos',
    'Arquivos completos e legíveis',
    'Links da entrega acessíveis',
  ];

  return (
    <div className={styles.page}>
      {/* ------------------------------------------- banner */}
      <Callout
        tone={approved ? 'success' : 'danger'}
        icon={
          approved ? (
            <FiCheckCircle size={22} aria-hidden="true" />
          ) : (
            <FiAlertTriangle size={22} aria-hidden="true" />
          )
        }
        title={approved ? 'Projeto aprovado e publicado!' : 'Ajustes solicitados'}
      >
        {approved
          ? 'A decisão foi registrada e o projeto já está disponível na vitrine do repositório.'
          : 'Orientador pediu correções. A equipe foi avisada e poderá reenviar a entrega.'}
      </Callout>

      {/* ------------------------------------------- resumo */}
      <Card padding="md" className={styles.summary}>
        <div className={styles.summaryTop}>
          <Badge tone={approved ? 'success' : 'warning'}>
            {approved ? 'Publicado' : 'Ajustes solicitados'}
          </Badge>
          <span className={styles.summaryMeta}>
            {approved
              ? project.publishedAt
                ? `Publicado em ${project.publishedAt}`
                : 'Publicado agora'
              : `Decisão em ${project.review?.decidedAt ?? 'hoje'}`}
          </span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.team}>
          {team?.members.join(' e ')} · {team?.publicLabel}
        </p>
      </Card>

      {/* ---------------------------------------- parecer */}
      <section className={styles.block}>
        <SectionHeader
          title={approved ? 'Parecer do orientador' : 'O que precisa de ajustes'}
        />
        <p className={styles.comment}>{message}</p>
        <ul className={styles.criteria}>
          {criteria.map((item) => (
            <li key={item} className={styles.criterion}>
              {approved ? (
                <FiCheckCircle className={styles.okIcon} aria-hidden="true" />
              ) : (
                <FiAlertTriangle className={styles.warnIcon} aria-hidden="true" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------ ações */}
      <div className={styles.actions}>
        {approved ? (
          <Link to={`/projeto/${project.slug}`} className={styles.primaryLink}>
            Ver projeto publicado
          </Link>
        ) : (
          <Link to={`/painel/entrega/${project.slug}`} className={styles.primaryLink}>
            Ver detalhe da entrega
          </Link>
        )}
        <Link to="/painel" className={styles.secondaryLink}>
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
