import React from 'react';
import { Link } from 'react-router-dom';
import {
  PencilLine,
  ListChecks,
  BarChart3,
  SlidersHorizontal,
  UserSearch,
  MessageSquare,
  FileText,
  ArrowRight,
} from '../../icons';
import './ShortcutCard.css';

/** Mapa de ícones aceitos (o mock envia a chave como string). */
const ICONS = {
  notes: PencilLine,
  criteria: ListChecks,
  report: BarChart3,
  course: SlidersHorizontal,
  evaluation: UserSearch,
  peer: MessageSquare,
  consolidated: BarChart3,
  file: FileText,
};

/**
 * Cartão de atalho: [ícone] [rótulo + perfil] → seta.
 * Usado na aba "Atalhos" do painel unificado.
 */
export default function ShortcutCard({ shortcut }) {
  const { icon, label, role, href } = shortcut;
  const Icon = ICONS[icon] || PencilLine;

  return (
    <li className="shortcut-card">
      <Link to={href} className="shortcut-card__link">
        <span className="shortcut-card__icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <span className="shortcut-card__text">
          <strong className="shortcut-card__label">{label}</strong>
          <span className="shortcut-card__role">{role}</span>
        </span>
        <span className="shortcut-card__arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      </Link>
    </li>
  );
}
