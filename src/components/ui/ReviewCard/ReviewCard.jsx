import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../Badge/Badge';
import { Clock, ArrowRight } from '../../icons';
import './ReviewCard.css';

/**
 * Cartão de projeto aguardando revisão do professor.
 * Estrutura: [status + relógio] [título] [curso] [autores] [envio] → ação
 */
export default function ReviewCard({ review }) {
  const { status, title, course, authors, submittedAt, action } = review;

  return (
    <article className="review-card">
      <div className="review-card__header">
        <Badge tone="amber">{status}</Badge>
        <span className="review-card__clock" aria-hidden="true">
          <Clock size={20} />
        </span>
      </div>

      <h3 className="review-card__title">{title}</h3>
      <p className="review-card__course">{course}</p>
      <p className="review-card__authors">{authors}</p>
      <p className="review-card__meta">{submittedAt}</p>

      <Link to={action.href} className="review-card__action">
        {action.label}
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
