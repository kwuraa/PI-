import React from 'react';
import Badge from '../Badge/Badge';
import './InfoCard.css';

/**
 * Cartão simples de painel: [selo] [título] [linha de contexto].
 * Usado em "Próximas bancas" e "Minhas orientações".
 */
export default function InfoCard({ badge, title, meta }) {
  return (
    <article className="info-card">
      <Badge tone={badge.tone}>{badge.label}</Badge>
      <h3 className="info-card__title">{title}</h3>
      <p className="info-card__meta">{meta}</p>
    </article>
  );
}
