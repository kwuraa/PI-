import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

import ProjectComments from '../components/project/ProjectComments.jsx';
import ProjectSidebar from '../components/project/ProjectSidebar.jsx';
import Button from '../components/ui/Button/Button.jsx';
import Callout from '../components/ui/Callout/Callout.jsx';
import Card from '../components/ui/Card/Card.jsx';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useEngagement } from '../context/EngagementContext.jsx';
import { getProjectBySlug, getTeam } from '../mocks/projectsMock.js';
import styles from './ProjectPage.module.css';

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const project = getProjectBySlug(slug);

  const { registerView } = useEngagement();

  const isLogged = Boolean(user);
  const team = getTeam(project);
  /** Dono do projeto (aluno da equipe) — decide ações e a nota de "curtir". */
  const isOwner = Boolean(
    user && team && team.members.includes(user.name)
  );

  /* Contabiliza a visita (uma view por sessão do navegador — protegido
     contra o duplo-mount do StrictMode pelo guard em memória do contexto). */
  useEffect(() => {
    if (project) registerView(project.slug);
  }, [project, registerView]);

  if (!project) {
    return (
      <div className={styles.page}>
        <Callout tone="danger" title="Projeto não encontrado">
          O endereço informado não existe ou o projeto foi removido.{' '}
          <Link to="/explorar">Voltar para a exploração</Link>.
        </Callout>
      </div>
    );
  }

  /** Linha de meta sob o h1: "Tipo · 2026.2 · Publicado em 02 out. 2026 · 24 salvos". */
  const period = project.year
    ? `${project.year}.${project.semester}`
    : `${project.semester}º semestre`;
  const published = project.publishedAt
    ? `Publicado em ${project.publishedAt}`
    : `Enviado em ${project.submittedAt}`;
  const metaLine = [
    project.type,
    period,
    published,
    `${project.saves} salvos`,
  ].join(' · ');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTexts}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.meta}>{metaLine}</p>
        </div>
      </header>

      <div className={styles.layout}>
        {/* ================================== coluna esquerda (conteúdo) */}
        <div className={styles.main}>
          {/* ------------------------------------------------- capa
              presente SOMENTE quando o projeto tem `image`.
              Fica aqui — e não acima do grid — porque o banner ocupa
              só a coluna esquerda, com as pílulas da
              coluna direita alinhadas ao topo dele. */}
          {project.image && (
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className={styles.cover}
            />
          )}

          <Card padding="md" className={styles.aboutCard}>
            <SectionHeader title="Sobre o projeto" />
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.chips} aria-label="Destaques e tecnologias">
              {project.highlights.map((highlight) => (
                <li key={highlight} className={styles.chip}>
                  {highlight}
                </li>
              ))}
              {project.technologies.map((tech) => (
                <li key={tech} className={`${styles.chip} ${styles.tech}`}>
                  {tech}
                </li>
              ))}
            </ul>
          </Card>

          {/* ------------------------------------------------- parecer
              (conteúdo interno: nome do orientador e texto da revisão —
              visível SOMENTE para quem está logado, LGPD) */}
          {isLogged && project.review && (
            <Callout
              tone="success"
              icon={<FiCheckCircle size={22} aria-hidden="true" />}
              title={`Parecer de ${project.review.advisor} · ${project.review.decidedAt}`}
            >
              <ul className={styles.criteria}>
                {project.review.criteria.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
              <p>{project.review.comment}</p>
            </Callout>
          )}

          <ProjectComments project={project} />

          {/* ------------------------------------ ações do dono / visitante */}
          {isOwner && project.status === 'em-analise' && (
            <Link
              to={`/aluno/status/${project.slug}`}
              className={styles.ownerAction}
            >
              Acompanhar análise
            </Link>
          )}

          {!isLogged && (
            <div className={styles.guestActions}>
              <Button fullWidth size="lg" onClick={() => navigate('/login')}>
                Entrar no sistema
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="secondary"
                onClick={() => navigate('/cadastro')}
              >
                Criar conta
              </Button>
            </div>
          )}
        </div>

        {/* ================================= coluna direita (resumo, sticky) */}
        <aside className={styles.side} aria-label="Resumo do projeto">
          <ProjectSidebar
            project={project}
            isLogged={isLogged}
            isOwner={isOwner}
          />
        </aside>
      </div>
    </div>
  );
}
