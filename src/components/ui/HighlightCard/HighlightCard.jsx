import React from 'react';
import { Share2 } from '../../icons';
import './HighlightCard.css';

/**
 * Cartão de destaque da tela Explorar (fundo rosa):
 * [sobretítulo] · [título] · [meta]          [ícone]
 */
export default function HighlightCard({ eyebrow, title, meta }) {
  return (
    <aside className="highlight-card">
      <div className="highlight-card__top">
        <span className="highlight-card__eyebrow">{eyebrow}</span>
        <span className="highlight-card__icon" aria-hidden="true">
          <Share2 size={22} />
        </span>
      </div>

      <strong className="highlight-card__title">{title}</strong>

      <span className="highlight-card__meta">{meta}</span>
    </aside>
  );
}
