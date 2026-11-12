/**
 * PI² — Navegação lateral do desktop (≥1024px), da área logada.
 * -----------------------------------------------------------------------------
 * Versão vertical da BottomNav: reutiliza os MESMOS destinos (`itemsFor`),
 * com pílula vermelha no item ativo. Professores/coordenadores ganham o
 * grupo "Área acadêmica" (Trabalhos enviados) e o rodapé traz Ajuda e
 * suporte + assinatura. Abaixo de 1024px ela fica oculta (a BottomNav
 * assume o lugar); ela NÃO re-anima entre rotas (regra do briefing).
 */
import { NavLink, Link } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx';
import { itemsFor } from '../BottomNav/BottomNav.jsx';
import styles from './SideNav.module.css';

export default function SideNav({ user }) {
  const { isRole } = useAuth();
  const items = itemsFor(user);
  const isStaff = Boolean(user) && (isRole('professor') || isRole('coordenador'));

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

        {isStaff && (
          <div className={styles.group}>
            <p className={styles.groupLabel}>Área acadêmica</p>
            <NavLink
              to="/painel/entregas"
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>
                <FiFolder size={20} aria-hidden="true" />
              </span>
              Trabalhos enviados
            </NavLink>
          </div>
        )}
      </nav>

      <div className={styles.foot}>
        <Link to="/ajuda" className={styles.help}>
          Ajuda e suporte
        </Link>
        <p className={styles.slogan}>PI² · Ideias que multiplicam conhecimento</p>
      </div>
    </aside>
  );
}
