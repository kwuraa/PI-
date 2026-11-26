import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiExternalLink,
  FiLock,
  FiUsers,
} from 'react-icons/fi';

import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Callout from '../ui/Callout/Callout.jsx';
import Card from '../ui/Card/Card.jsx';
import FileList from '../ui/FileList/FileList.jsx';
import FileRow from '../ui/FileRow/FileRow.jsx';
import { statusMeta } from '../../utils/status.js';
import { COURSE_SHORT, getTeam } from '../../mocks/projectsMock.js';
import styles from './ProjectBlock.module.css';

/** Turma canônica do semestre corrente. */
const TURMA = '2026.2';

/** Data por situação: publicado usa a data de publicação; senão, de envio. */
function dateLineFor(project) {
  if (project.status === 'publicado') return `Publicado em ${project.publishedAt}`;
  if (project.status === 'rascunho') return `Rascunho salvo em ${project.submittedAt}`;
  return `Enviado em ${project.submittedAt}`;
}

/**
 * Ação principal do bloco, coerente com o status do projeto
 * (rótulo, rota real e ícone — nenhum destino "falso").
 */
function actionFor(project) {
  switch (project.status) {
    case 'publicado':
      return {
        label: 'Ver projeto',
        to: `/projeto/${project.slug}`,
        Icon: FiExternalLink,
        hint: 'Página pública do projeto na vitrine.',
      };
    case 'em-analise':
      return {
        label: 'Revisar projeto',
        to: `/painel/revisar/${project.slug}`,
        Icon: FiArrowRight,
        hint: 'Envio aguardando o seu parecer.',
      };
    case 'ajustes':
      return {
        label: 'Ver resultado da análise',
        to: `/painel/resultado/${project.slug}`,
        Icon: FiArrowRight,
        hint: 'Ajustes solicitados à equipe.',
      };
    default:
      // Rascunho: ainda não há envio para revisar — a referência é a ficha
      // do grupo na gestão (é lá que o rascunho aparece).
      return {
        label: 'Ver grupo na gestão',
        to: '/painel/grupos',
        Icon: FiUsers,
        hint: 'A equipe ainda não enviou o projeto para análise.',
      };
  }
}

/** Nota de aprovação da coluna de links — apenas para projetos publicados. */
function approvalNoteFor(project) {
  if (project.status !== 'publicado') return null;
  return `Projeto aprovado em ${project.publishedAt}. Acompanhe o parecer no histórico de revisão.`;
}

export default function ProjectBlock({ project }) {
  const team = getTeam(project);
  const status = statusMeta(project.status);
  const live = project.links.live;
  const repository = project.links.repository;
  const action = actionFor(project);
  const approvalNote = approvalNoteFor(project);
  const ActionIcon = action.Icon;
  const headingId = `projeto-${project.id}`;

  return (
    <article className={styles.project} aria-labelledby={headingId}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={styles.identity}>
            <div className={styles.badgesRow}>
              <Badge tone="primary">{COURSE_SHORT}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <h3 id={headingId} className={styles.projectTitle}>
              {project.title}
            </h3>
            <div className={styles.meta}>
              <p>
                {project.type} · Turma {TURMA}
              </p>
              <p>
                {dateLineFor(project)} · {project.saves} salvos
              </p>
            </div>
            <p className={styles.team}>{team?.members.join(' e ')}</p>
            <p className={styles.advisor}>Orientador: {team?.advisor}</p>

            {/* ação coerente com o status (ver actionFor) */}
            <div className={styles.actions}>
              <Link to={action.to} className={styles.actionLink}>
                <Button variant="secondary" icon={<ActionIcon aria-hidden="true" />}>
                  {action.label}
                </Button>
              </Link>
              <span className={styles.actionHint}>{action.hint}</span>
            </div>
          </div>

          <Card padding="md" className={styles.card}>
            <h4 className={styles.cardTitle}>Sobre o projeto</h4>
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.tags} aria-label="Destaques do projeto">
              {project.highlights.map((highlight) => (
                <li key={highlight} className={styles.tag}>
                  {highlight}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md" className={styles.card}>
            <h4 className={styles.cardTitle}>
              Meus documentos · {project.files.length} arquivos
            </h4>
            {/* ladrilho do arquivo: bloco de token, sem imagem */}
            <FileList>
              {project.files.map((file) => (
                <FileRow
                  key={file.id}
                  name={file.name}
                  meta={`${file.kind} · ${file.size}`}
                  icon="square"
                  variant="page"
                />
              ))}
            </FileList>
          </Card>

          <Callout
            tone="danger"
            icon={<FiLock size={22} aria-hidden="true" />}
            title="Seus materiais, acessos diferentes"
          >
            Na visualização pública, ficam disponíveis o relatório para leitura
            e o link do projeto. O repositório e o ZIP não são exibidos.
          </Callout>
        </div>

        <aside
          className={styles.side}
          aria-label={`Links do projeto ${project.title}`}
        >
          <h4 className={styles.sideTitle}>Links do projeto</h4>

          {live && (
            <Card padding="md" className={styles.linkCard}>
              <strong className={styles.linkTitle}>{live.title}</strong>
              <p className={styles.linkHint}>{live.hint}</p>
              <code className={styles.linkLabel}>{live.label}</code>
              <a
                href={`https://${live.label}`}
                target="_blank"
                rel="noreferrer"
                className={styles.linkAnchor}
              >
                <Button fullWidth icon={<FiExternalLink aria-hidden="true" />}>
                  Acessar projeto
                </Button>
              </a>
            </Card>
          )}

          {repository && (
            <Card padding="md" className={styles.linkCard}>
              <strong className={styles.linkTitle}>{repository.title}</strong>
              <p className={styles.linkHint}>{repository.hint}</p>
              <code className={styles.linkLabel}>{repository.label}</code>
              <a
                href={`https://${repository.label}`}
                target="_blank"
                rel="noreferrer"
                className={styles.linkAnchor}
              >
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<FiExternalLink aria-hidden="true" />}
                >
                  Abrir repositório no GitHub
                </Button>
              </a>
            </Card>
          )}

          {approvalNote && (
            <p className={styles.approvalNote}>{approvalNote}</p>
          )}
        </aside>
      </div>
    </article>
  );
}
