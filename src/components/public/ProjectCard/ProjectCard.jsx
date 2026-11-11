/**
 * PI² — Card de projeto (vitrine, explorar e "meus projetos").
 * -----------------------------------------------------------------------------
 * Variantes:
 *  • 'public' → LGPD: equipe ANONIMIZADA ("Equipe DSM — Xº Semestre");
 *               usada em telas visitantes e na vitrine pública.
 *  • 'logged' → nomes completos do time + orientador (área logada).
 *  • 'mine'   → cartão do aluno com status e ação principal
 *               (Acompanhar análise / Ver projeto).
 *
 * Sem imagens: o protótipo usa blocos de cor; aqui o "capa" é um
 * gradiente de tokens (nada de cores fixas fora de variables.css).
 */
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiUsers } from 'react-icons/fi';
import Badge from '../../ui/Badge/Badge.jsx';
import { COURSE_SHORT, getTeam, teamDisplay } from '../../../mocks/projectsMock.js';
import styles from './ProjectCard.module.css';

/** Mapeia o status do projeto para o selo exibido. */
export function statusMeta(status) {
  switch (status) {
    case 'publicado':
      return { label: 'Publicado', tone: 'success' };
    case 'em-analise':
      return { label: 'Em análise', tone: 'warning' };
    case 'ajustes':
      return { label: 'Ajustes solicitados', tone: 'primary' };
    default:
      return { label: 'Rascunho', tone: 'neutral' };
  }
}

export default function ProjectCard({ project, variant = 'public', action = null }) {
  const team = getTeam(project);
  const display = teamDisplay(project, { publicView: variant === 'public' });
  const status = statusMeta(project.status);
  const isMine = variant === 'mine';

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <Badge tone={status.tone}>{status.label}</Badge>
        <span className={styles.semester}>
          {COURSE_SHORT} · {project.semester}º semestre
        </span>
      </div>

      <h3 className={styles.title}>
        <Link to={`/projeto/${project.slug}`} className={styles.titleLink}>
          {project.title}
        </Link>
      </h3>

      <p className={styles.description}>{project.description}</p>

      <ul className={styles.techs} aria-label="Tecnologias">
        {project.technologies.slice(0, 3).map((tech) => (
          <li key={tech} className={styles.tech}>
            {tech}
          </li>
        ))}
      </ul>

      <p className={styles.team}>
        <FiUsers aria-hidden="true" />
        <span>
          {display.primary}
          {display.secondary && variant !== 'public' ? ` · ${display.secondary}` : ''}
        </span>
      </p>

      <div className={styles.footer}>
        {action ?? (
          <Link to={`/projeto/${project.slug}`} className={styles.action}>
            Ver projeto
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        )}
        {variant === 'public' && team && (
          <span className={styles.saves}>{project.saves} salvos</span>
        )}
      </div>
    </article>
  );
}
