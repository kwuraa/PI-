import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../../icons';
import './PendingCard.css';

/**
 * Cartão de pendência: [número grande] [título + contexto] → ação.
 * Ex.: "1 Sala com notas pendentes → Lançar notas".
 */
export default function PendingCard({ value, title, meta, action }) {
  return (
    <article className="pending-card">
      <div className="pending-card__row">
        <strong className="pending-card__value">{value}</strong>
        <span className="pending-card__text">
          <strong className="pending-card__title">{title}</strong>
          {meta && <span className="pending-card__meta">{meta}</span>}
        </span>
      </div>

      <Link to={action.href} className="pending-card__action">
        {action.label}
        <ArrowRight size={18} />
      </Link>
    </article>
  );
}
