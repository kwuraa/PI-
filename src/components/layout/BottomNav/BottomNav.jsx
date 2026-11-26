import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBookOpen,
  FiCompass,
  FiGrid,
  FiLayers,
  FiLogIn,
  FiUser,
} from 'react-icons/fi';

import { useAuth } from '../../../context/AuthContext.jsx';
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

/* Coordenação tem acesso ao cadastro de cursos, antes restrito à secretaria. */
const COORDENACAO_ITEMS = [
  { to: '/explorar', Icon: FiCompass, label: 'Explorar' },
  { to: '/painel', Icon: FiGrid, label: 'Painel' },
  { to: '/secretaria/cursos', Icon: FiBookOpen, label: 'Cursos' },
  { to: '/perfil', Icon: FiUser, label: 'Perfil' },
];

/** Escolhe a barra conforme o espaço ativo (ou visitante). */
export function itemsFor(user, activeRoles = user?.roles ?? []) {
  if (!user) return GUEST_ITEMS;
  if (activeRoles.includes('aluno')) return ALUNO_ITEMS;
  if (activeRoles.includes('coordenador')) return COORDENACAO_ITEMS;
  return EQUIPE_ITEMS;
}

export default function BottomNav({ user }) {
  const { activeRoles } = useAuth();
  const items = itemsFor(user, activeRoles);

  return (
    <nav className={styles.nav} aria-label="Navegação principal" data-print-hide>
      {items.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/aluno' || to === '/painel'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={styles.iconPill}>
                {isActive && (
                  <motion.span
                    className={styles.pillBg}
                    layoutId="bottomNavPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                  />
                )}
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
