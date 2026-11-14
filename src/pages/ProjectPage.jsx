/**
 * PI² — Detalhes do projeto (rota "/projeto/:slug").
 * -----------------------------------------------------------------------------
 * Duas leituras na mesma tela:
 *  • VISITANTE → "leitura pública": equipe ANONIMIZADA (LGPD) e SEM dados
 *    sensíveis: sem parecer (nome do orientador e texto interno), sem
 *    lista de comentários (nomes de autores) e sem arquivos — apenas o
 *    convite para entrar no sistema;
 *  • LOGADO → visão completa: nomes da equipe, arquivos, parecer e comentários.
 * O dono do projeto (aluno) encontra o atalho "Acompanhar análise".
 * Regra de comentários: só quem tem cadastro (aluno, professor etc.)
 * comenta — o público geral não precisa de acesso à área de comentários.
 *
 * LAYOUT (mockup desktop 02):
 *  • topo → h1 + linha de meta (tipo · ano.semestre · publicação · salvos);
 *  • mobile → tudo empilhado em 1 coluna;
 *  • desktop ≥1024px → grid de 2 colunas: coluna ESQUERDA larga (cards
 *    "Sobre o projeto" e "Comentários", parecer e ações) e coluna DIREITA
 *    estreita (~350px, sticky) com as pílulas de status, a equipe e os
 *    arquivos do projeto.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiFileText,
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
  COURSE_SHORT,
  getProjectBySlug,
  getTeam,
  teamDisplay,
} from '../mocks/projectsMock.js';
import styles from './ProjectPage.module.css';

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
      <header className={styles.header}>
        <div className={styles.headerTexts}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.meta}>{metaLine}</p>
        </div>
      </header>

      <div className={styles.layout}>
        {/* ================================== coluna esquerda (conteúdo) */}
        <div className={styles.main}>
          {/* ------------------------------------------------- sobre */}
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

          {/* ----------------------------------------------- comentários */}
          <Card padding="md" className={styles.commentsCard}>
            <SectionHeader
              title={`Comentários · ${comments.length} ${
                comments.length === 1 ? 'comentário' : 'comentários'
              }`}
            />

            {/* Lista de comentários RESERVADA a quem está logado (os autores
                podem ter nome real — LGPD); o visitante vê só a contagem e
                o convite de acesso. */}
            {isLogged && comments.length === 0 && (
              <p className={styles.emptyComments}>
                Seja o primeiro a comentar este projeto.
              </p>
            )}

            {isLogged && (
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
            )}

            {isLogged ? (
              <form className={styles.commentForm} onSubmit={handleComment}>
                <TextField
                  label="Participe da conversa"
                  placeholder="Escreva um comentário..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  type="submit"
                  icon={<FiSend aria-hidden="true" />}
                  disabled={!comment.trim()}
                >
                  Enviar comentário
                </Button>
              </form>
            ) : (
              <Callout
                tone="neutral"
                icon={<FiAlertTriangle size={20} aria-hidden="true" />}
                title="Entre para comentar"
              >
                <Link to="/login">Acesse com sua conta institucional</Link> para
                comentar e acompanhar novidades.
              </Callout>
            )}
          </Card>

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
          {/* --------------------------------------------- pílulas */}
          <div className={styles.pills}>
            <Badge tone="primary">{COURSE_SHORT}</Badge>
            <Badge tone={status.tone}>{status.label}</Badge>
            {!isLogged && <Badge tone="neutral">Visualização pública</Badge>}
          </div>

          {/* ------------------------------------------------- equipe */}
          <Card padding="md" className={styles.teamCard}>
            <SectionHeader title="Desenvolvido por:" />
            {isLogged ? (
              <>
                <ul className={styles.members}>
                  {team.members.map((member) => (
                    <li key={member} className={styles.person}>
                      <Avatar
                        initials={member
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                        tone="neutral"
                        size="sm"
                      />
                      <span className={styles.personTexts}>
                        <strong>{member}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={styles.person}>
                  <Avatar
                    initials={team.advisorInitials}
                    tone="primary"
                    size="sm"
                  />
                  <span className={styles.personTexts}>
                    <strong>{team.advisor}</strong>
                    <span>Orientador</span>
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.person}>
                <Avatar initials={COURSE_SHORT} tone="primary" size="sm" />
                <span className={styles.personTexts}>
                  <strong>{display.primary}</strong>
                  <span>{COURSE}</span>
                </span>
              </div>
            )}
          </Card>

          {/* ----------------------------------------------- arquivos */}
          {isLogged && project.files.length > 0 && (
            <Card padding="md" className={styles.filesCard}>
              <SectionHeader title="Arquivos do projeto" />
              <a className={styles.filesCount} href="#arquivos-do-projeto">
                {project.files.length}{' '}
                {project.files.length === 1 ? 'arquivo' : 'arquivos'}
              </a>
              <ul className={styles.files} id="arquivos-do-projeto">
                {project.files.map((file) => (
                  <li key={file.id} className={styles.file}>
                    <span className={styles.fileIcon} aria-hidden="true">
                      <FiFileText />
                    </span>
                    <span className={styles.fileTexts}>
                      <strong>{file.name}</strong>
                      <span>
                        {file.kind} · {file.size}
                      </span>
                    </span>
                    <button
                      type="button"
                      className={styles.fileDownload}
                      aria-label={`Baixar ${file.name}`}
                    >
                      <FiDownload aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
