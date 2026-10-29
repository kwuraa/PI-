import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, LayoutGrid, Bookmark, User } from '../../icons';
import './BottomNav.css';

/**
 * Navegação inferior fixa (mobile).
 * Recebe os itens por prop para que cada perfil (aluno/professor)
 * monte sua própria barra sem duplicar componente.
 */
const DEFAULT_ITEMS = [
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/painel', label: 'Painel', icon: LayoutGrid },
  { to: '/salvos', label: 'Salvos', icon: Bookmark },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function BottomNav({ items = DEFAULT_ITEMS }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <ul className="bottom-nav__list">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="bottom-nav__item">
            <NavLink
              to={to}
              className={({ isActive }) =>
                ['bottom-nav__link', isActive && 'bottom-nav__link--active']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className="bottom-nav__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="bottom-nav__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
