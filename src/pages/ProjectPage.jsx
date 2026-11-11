/**
 * PI² — Detalhes do projeto (rota "/projeto/:slug").
 * -----------------------------------------------------------------------------
 * Duas leituras na mesma tela:
 *  • VISITANTE → "leitura pública": equipe ANONIMIZADA (LGPD), arquivos e
 *    comentários reservados, convite para entrar no sistema;
 *  • LOGADO → visão completa: nomes da equipe, arquivos, parecer e comentários.
 * O dono do projeto (aluno) encontra o atalho "Acompanhar análise".
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiGlobe,
  FiSend,
} from 'react-icons/fi';

import Avatar from '../components/ui/Avatar/Avatar.jsx';
import Badge from '../components/ui/Badge/Badge.jsx';
import Button from '../components/ui/Button/Button.jsx';
import Callout from '../components/ui/Callout/Callout.jsx';
import Card from '../components/ui/Card/Card.jsx';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader.jsx';
import TextField from '../components/ui/TextField/TextField.jsx';
import { statusMeta } from '../components/public/ProjectCard/ProjectCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  COURSE,
  getProjectBySlug,
  getTeam,
  teamDisplay,
} from '../mocks/projectsMock.js';
import styles from './ProjectPage.module.css';

/** Ícone de cada tipo de link externo. */
const LINK_ICONS = {
  live: FiGlobe,
  repository: FiGithub,
  docs: FiFileText,
};

export default function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const project = getProjectBySlug(slug);

  const isLogged = Boolean(user);
  const team = getTeam(project);
  const display = project ? teamDisplay(project, { publicView: !isLogged }) : null;
  const isOwner = Boolean(
    user && team && team.members.includes(user.name)
  );

  /** Comentários em estado local (o envio só existe na área logada). */
  const [comment, setComment] = useState('');
  const [extraComments, setExtraComments] = useState([]);
  const comments = useMemo(
    () => [...(project?.comments ?? []), ...extraComments],
    [project, extraComments]
  );

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

  const status = statusMeta(project.status);

  const handleComment = (event) => {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;
    setExtraComments((prev) => [
      ...prev,
      {
        id: `cmt-local-${prev.length + 1}`,
        author: user.name,
        initials: user.initials,
        when: 'Agora',
        text,
        team: team?.members.includes(user.name) ?? false,
      },
    ]);
    setComment('');
  };

  return (
    <div className={styles.page}>
      {/* --------------------------------------------------- topo */}
      <div className={styles.badges}>
        <Badge tone={status.tone}>{status.label}</Badge>
        {!isLogged && <Badge tone="primary">Visualização pública</Badge>}
        <span className={styles.meta}>
          {project.type} · {project.year} · {project.semester}º semestre
        </span>
      </div>

      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.description}>{project.description}</p>

      <ul className={styles.chips} aria-label="Destaques">
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

      {/* --------------------------------------------------- equipe */}
      <Card padding="md" className={styles.teamCard}>
        <SectionHeader title="Equipe" />
        {isLogged ? (
          <>
            <ul className={styles.members}>
              {team.members.map((member) => (
                <li key={member} className={styles.member}>
                  <Avatar
                    initials={member
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                    tone="neutral"
                    size="sm"
                  />
                  {member}
                </li>
              ))}
            </ul>
            <p className={styles.advisor}>Orientador(a): {team.advisor}</p>
          </>
        ) : (
          <p className={styles.publicTeam}>
            <strong>Desenvolvido por: {display.primary}</strong>
            <span>{COURSE}</span>
          </p>
        )}
      </Card>

      {/* --------------------------------------------------- links */}
      <section className={styles.block}>
        <SectionHeader title="Links do projeto" />
        <div className={styles.links}>
          {Object.entries(project.links).map(([key, link]) => {
            const Icon = LINK_ICONS[key];
            return (
              <a
                key={key}
                className={styles.linkCard}
                href={`https://${link.label}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.linkIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <span className={styles.linkTexts}>
                  <strong>{link.title}</strong>
                  <span>{link.hint}</span>
                  <code className={styles.linkLabel}>{link.label}</code>
                </span>
                <FiExternalLink className={styles.linkArrow} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------- arquivos (logado) */}
      {isLogged && project.files.length > 0 && (
        <section className={styles.block}>
          <SectionHeader title="Arquivos entregues" />
          <ul className={styles.files}>
            {project.files.map((file) => (
              <li key={file.id} className={styles.file}>
                <FiFileText aria-hidden="true" />
                <span className={styles.fileTexts}>
                  <strong>{file.name}</strong>
                  <span>
                    {file.kind} · {file.size} · {file.version}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------- parecer */}
      {project.review && (
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

      {/* ------------------------------------------------ comentários */}
      <section className={styles.block}>
        <SectionHeader title={`Comentários (${comments.length})`} />

        {comments.length === 0 && (
          <p className={styles.emptyComments}>Seja o primeiro a comentar este projeto.</p>
        )}

        <ul className={styles.comments}>
          {comments.map((item) => (
            <li key={item.id} className={styles.comment}>
              <Avatar
                initials={item.initials ?? '·'}
                tone={item.team ? 'primary' : 'neutral'}
                size="sm"
              />
              <div className={styles.commentBody}>
                <p className={styles.commentHead}>
                  <strong>{item.author}</strong>
                  <span>{item.when}</span>
                </p>
                <p className={styles.commentText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {isLogged ? (
          <form className={styles.commentForm} onSubmit={handleComment}>
            <TextField
              label="Comentar"
              placeholder="Escreva um comentário…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" icon={<FiSend aria-hidden="true" />} disabled={!comment.trim()}>
              Enviar
            </Button>
          </form>
        ) : (
          <Callout
            tone="neutral"
            icon={<FiAlertTriangle size={20} aria-hidden="true" />}
            title="Entre para comentar"
          >
            <Link to="/login">Acesse com sua conta institucional</Link> para
            comentar, salvar projetos e acompanhar novidades.
          </Callout>
        )}
      </section>

      {/* ------------------------------------ ações do dono / visitante */}
      {isOwner && project.status === 'em-analise' && (
        <Link to={`/aluno/status/${project.slug}`} className={styles.ownerAction}>
          Acompanhar análise
        </Link>
      )}

      {!isLogged && (
        <div className={styles.guestActions}>
          <Button fullWidth size="lg" onClick={() => navigate('/login')}>
            Entrar no sistema
          </Button>
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/cadastro')}>
            Criar conta
          </Button>
        </div>
      )}
    </div>
  );
}
