import React from 'react';
import { ClipboardCheck, Users } from '../../icons';
import './StatCard.css';

const ICONS = {
  review: ClipboardCheck,
  advising: Users,
};

/**
 * Cartão de estatística do painel (número grande + legenda).
 * variant: 'primary' (fundo vermelho) | 'default' (fundo claro).
 */
export default function StatCard({
  icon = 'review',
  value,
  label,
  variant = 'default',
}) {
  const Icon = ICONS[icon] || ClipboardCheck;

  return (
    <article className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <div className="stat-card__body">
        <strong className="stat-card__value">{value}</strong>
        <span className="stat-card__label">{label}</span>
      </div>
    </article>
  );
}
