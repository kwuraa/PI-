import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link2Off, AlertTriangle, ShieldCheck, Info } from '../../icons';
import Button from '../Button/Button';
import './AlertCard.css';

const ICONS = {
  'link-off': Link2Off,
  warning: AlertTriangle,
  shield: ShieldCheck,
  info: Info,
};

/**
 * Cartão de alerta: título vermelho + descrição + ação.
 * A ação pode ser botão (onClick) ou link interno (href).
 * `action.arrow: false` remove a seta (ex.: botão "Resolver" simples).
 */
export default function AlertCard({
  icon = 'link-off',
  title,
  description,
  action,
}) {
  const Icon = ICONS[icon] || Link2Off;

  return (
    <aside className="alert-card">
      <div className="alert-card__header">
        <span className="alert-card__icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <strong className="alert-card__title">{title}</strong>
      </div>

      <p className="alert-card__description">{description}</p>

      {action &&
        (action.href ? (
          <Link to={action.href} className="alert-card__action">
            {action.label}
            {action.arrow !== false && <ArrowRight size={20} />}
          </Link>
        ) : (
          <Button fullWidth onClick={action.onClick}>
            {action.label}
            {action.arrow !== false && <ArrowRight size={20} />}
          </Button>
        ))}
    </aside>
  );
}
