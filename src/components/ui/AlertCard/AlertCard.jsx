import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link2Off, AlertTriangle, ShieldCheck, Info, Clock, Users, GitBranch, Lock } from '../../icons';
import Button from '../Button/Button';
import './AlertCard.css';

const ICONS = {
  'link-off': Link2Off,
  warning: AlertTriangle,
  shield: ShieldCheck,
  info: Info,
  clock: Clock,
  users: Users,
  'git-branch': GitBranch,
  lock: Lock,
};

/**
 * Cartão de alerta: título + descrição + ação opcional.
 * tone: 'primary' (vermelho) | 'amber' (atenção) | 'success' (positivo).
 * A ação pode ser botão (onClick) ou link interno (href).
 * `action.arrow: false` remove a seta (ex.: botão "Resolver" simples).
 */
export default function AlertCard({
  icon = 'link-off',
  tone = 'primary',
  title,
  description,
  action,
}) {
  const Icon = ICONS[icon] || Link2Off;

  return (
    <aside className={`alert-card alert-card--${tone}`}>
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
