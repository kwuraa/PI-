import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Link2Off } from '../../icons';
import Button from '../Button/Button';
import './AlertCard.css';

const ICONS = {
  'link-off': Link2Off,
};

/**
 * Cartão de alerta: título vermelho + descrição + ação.
 * A ação pode ser botão (onClick) ou link interno (href).
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
            {action.label} <ArrowRight size={20} />
          </Link>
        ) : (
          <Button fullWidth onClick={action.onClick}>
            {action.label} <ArrowRight size={20} />
          </Button>
        ))}
    </aside>
  );
}
