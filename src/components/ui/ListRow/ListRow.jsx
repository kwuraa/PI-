import React from 'react';
import { Link } from 'react-router-dom';
import { PencilLine, Users, MessageSquare, FileText, ArrowRight } from '../../icons';
import './ListRow.css';

const ICONS = {
  pencil: PencilLine,
  users: Users,
  message: MessageSquare,
  file: FileText,
};

/**
 * Linha de lista do painel: [ícone] [número] [rótulo] → seta.
 * Se `href` for informado, a linha inteira vira um link.
 * tone: 'neutral' (bege) | 'amber' (âmbar) — cor do quadro do ícone.
 */
export default function ListRow({ icon = 'pencil', value, label, href = '#', tone = 'neutral' }) {
  const Icon = ICONS[icon] || PencilLine;

  return (
    <Link to={href} className="list-row">
      <span
        className={`list-row__icon list-row__icon--${tone}`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <strong className="list-row__value">{value}</strong>
      <span className="list-row__label">{label}</span>
      <span className="list-row__arrow" aria-hidden="true">
        <ArrowRight size={18} />
      </span>
    </Link>
  );
}
