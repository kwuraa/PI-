import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, PencilLine, MoreHorizontal } from '../../icons';
import './ProjectCard.css';

const STATUS_LABELS = {
  published: 'Publicado',
  'in-review': 'Em análise',
  draft: 'Rascunho',
};

const META_ICONS = {
  check: Check,
  clock: Clock,
  pencil: PencilLine,
};

/**
 * Cartão de projeto da área do aluno.
 * status: 'published' | 'in-review' | 'draft'
 */
export default function ProjectCard({ project }) {
  const { status, title, course, period, meta, action } = project;
  const MetaIcon = META_ICONS[meta.icon] || Clock;

  return (
    <article className={`project-card project-card--${status}`}>
      <header className="project-card__header">
        <span className="project-card__status">
          {STATUS_LABELS[status] ?? status}
        </span>
        <button
          type="button"
          className="project-card__menu"
          aria-label={`Opções de ${title}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </header>

      <h3 className="project-card__title">{title}</h3>

      <p className="project-card__course">
        {course} · {period}
      </p>

      <p className="project-card__meta">
        <MetaIcon size={16} />
        <span>{meta.text}</span>
      </p>

      <Link to={action.href} className="project-card__action">
        <span>{action.label}</span>
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
