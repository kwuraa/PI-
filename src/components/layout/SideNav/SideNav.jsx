/**
 * PI² — Navegação lateral do desktop (≥1024px), da área logada.
 * -----------------------------------------------------------------------------
 * Versão vertical da BottomNav: reutiliza os MESMOS destinos (`itemsFor`),
 * com pílula vermelha no item ativo. No rodapé, apoio + assinatura.
 * Abaixo de 1024px ela fica oculta (a BottomNav fixa assume o lugar);
 * ela NÃO re-anima entre rotas (regra do briefing).
 */
import { NavLink } from 'react-router-dom';
import { itemsFor } from '../BottomNav/BottomNav.jsx';
import styles from './SideNav.module.css';

export default function SideNav({ user }) {
  const items = itemsFor(user);

  return (
    <aside className={styles.side} aria-label="Navegação lateral">
      <nav className={styles.nav}>
        {items.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/aluno' || to === '/painel'}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>
              <Icon size={20} aria-hidden="true" />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.foot}>
        <span className={styles.help}>Ajuda e suporte</span>
        <p className={styles.slogan}>PI² · Ideias que multiplicam conhecimento</p>
      </div>
    </aside>
  );
}
