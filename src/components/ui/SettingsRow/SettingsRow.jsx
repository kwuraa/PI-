import React from 'react';
import { Link } from 'react-router-dom';
import { Key, ShieldCheck, HelpCircle, ChevronRight } from '../../icons';
import './SettingsRow.css';

/** Mapa de ícones aceitos (o mock envia a chave como string). */
const ICONS = {
  key: Key,
  shield: ShieldCheck,
  help: HelpCircle,
};

/**
 * Linha de ajustes de conta: [ícone] [rótulo] → chevron.
 * Se `href` for informado, a linha inteira vira um link.
 */
export default function SettingsRow({ icon = 'key', label, href = '#' }) {
  const Icon = ICONS[icon] || Key;

  return (
    <li className="settings-row">
      <Link to={href} className="settings-row__link">
        <span className="settings-row__icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <span className="settings-row__label">{label}</span>
        <span className="settings-row__chevron" aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      </Link>
    </li>
  );
}
