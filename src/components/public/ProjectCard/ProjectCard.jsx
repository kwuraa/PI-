/**
 * PI² — Card de projeto (vitrine, explorar e "meus projetos").
 * -----------------------------------------------------------------------------
 * Variantes:
 *  • 'vitrine' → vitrine pública da Welcome: SEM status/tecnologias/salvos;
 *               pílula "DSM — Xº Semestre" no topo e crédito
 *               "Desenvolvido por: …" num rodapé próprio (mockup 01).
 *  • 'public' → LGPD: equipe ANONIMIZADA ("Equipe DSM — Xº Semestre");
 *               usada em telas visitantes e na vitrine pública.
 *  • 'logged' → nomes completos do time + orientador (área logada).
 *  • 'mine'   → cartão do aluno com status e ação principal
 *               (Acompanhar análise / Ver projeto).
 *
 * Sem imagens: o protótipo usa blocos de cor; aqui o "capa" é um
 * gradiente de tokens (nada de cores fixas fora de variables.css).
 * `index` (0, 1, 2…) define o atraso do card na entrada em cascata.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiUsers } from 'react-icons/fi';
import Badge from '../../ui/Badge/Badge.jsx';
import { cardIn } from '../../../styles/motion.js';
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

export default function ProjectCard({ project, variant = 'public', action = null, index = 0 }) {
  const team = getTeam(project);
  const display = teamDisplay(project, { publicView: variant === 'public' || variant === 'vitrine' });
  const status = statusMeta(project.status);
  const isMine = variant === 'mine';

  /**
   * Clique esticado: em qualquer ponto do card o visitante navega para o
   * projeto (resolve cards "sem função" na vitrine/explorar sem login).
   * Exceções: variante 'mine' e cards com `action` própria (destino próprio).
   */
  const stretch = variant !== 'mine' && action == null;
  const titleClassName = stretch
    ? `${styles.titleLink} ${styles.stretch}`
    : styles.titleLink;

  /* Variante vitrine (Welcome): pílula do semestre + crédito da equipe. */
  if (variant === 'vitrine') {
    return (
      <motion.article className={styles.card} {...cardIn(index)}>
        <span className={styles.pill}>
          {COURSE_SHORT} — {project.semester}º Semestre
        </span>

        <h3 className={styles.title}>
          <Link to={`/projeto/${project.slug}`} className={titleClassName}>
            {project.title}
          </Link>
        </h3>

        <p className={styles.description}>{project.description}</p>

        <p className={styles.credit}>Desenvolvido por: {display.primary}</p>
      </motion.article>
    );
  }

  return (
    <motion.article className={styles.card} {...cardIn(index)}>
      <div className={styles.topRow}>
        <Badge tone={status.tone}>{status.label}</Badge>
        <span className={styles.semester}>
          {COURSE_SHORT} · {project.semester}º semestre
        </span>
      </div>

      <h3 className={styles.title}>
        <Link to={`/projeto/${project.slug}`} className={titleClassName}>
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
    </motion.article>
  );
}
