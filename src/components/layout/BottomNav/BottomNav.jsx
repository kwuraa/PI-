/**
 * PI² — Navegação inferior persistente (3 destinos).
 * Ícones: react-icons/feather (traço fino igual ao dos protótipos).
 * Os itens mudam conforme o perfil logado (aluno: Meus projetos;
 * professor/coordenador/secretaria: Painel). O destino ativo ganha
 * pílula vermelha de fundo no ícone.
 */
import { NavLink } from 'react-router-dom';
import { FiCompass, FiGrid, FiLayers, FiLogIn, FiUser } from 'react-icons/fi';
import styles from './BottomNav.module.css';

const GUEST_ITEMS = [
  { to: '/explorar', Icon: FiCompass, label: 'Explorar' },
  { to: '/login', Icon: FiLogIn, label: 'Entrar' },
  { to: '/perfil', Icon: FiUser, label: 'Perfil' },
];

const ALUNO_ITEMS = [
  { to: '/explorar', Icon: FiCompass, label: 'Explorar' },
  { to: '/aluno', Icon: FiLayers, label: 'Meus projetos' },
  { to: '/perfil', Icon: FiUser, label: 'Perfil' },
];

const EQUIPE_ITEMS = [
  { to: '/explorar', Icon: FiCompass, label: 'Explorar' },
  { to: '/painel', Icon: FiGrid, label: 'Painel' },
  { to: '/perfil', Icon: FiUser, label: 'Perfil' },
];

/** Escolhe a barra conforme os roles do usuário (ou visitante). */
export function itemsFor(user) {
  if (!user) return GUEST_ITEMS;
  if (user.roles.includes('aluno')) return ALUNO_ITEMS;
  return EQUIPE_ITEMS;
}

export default function BottomNav({ user }) {
  const items = itemsFor(user);

  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {items.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/aluno' || to === '/painel'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.iconPill}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
