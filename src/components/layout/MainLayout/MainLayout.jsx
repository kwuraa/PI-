/**
 * PI² — Shell da área logada: TopBar de fora a fora + SideNav (desktop) +
 * conteúdo + BottomNav.
 * -----------------------------------------------------------------------------
 * Regra de animação: a entrada/saída do conteúdo acontece APENAS no <main>
 * (stage), com framer-motion (AnimatePresence mode="wait" + `key` por rota).
 * TopBar, SideNav e BottomNav ficam fora do stage e, por isso, NÃO re-animam
 * entre rotas. O stage renderiza breadcrumb (decorrido da rota) e rodapé
 * interno junto com a página (fazem parte do conteúdo).
 *
 * Props:
 *  • barVariant: 'brand' | 'stack' (como a barra superior se apresenta)
 *  • title / action: usados na variante 'stack' (e no último item do breadcrumb)
 */
import { useMemo } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '../../../context/AuthContext.jsx';
import BottomNav from '../BottomNav/BottomNav.jsx';
import SideNav from '../SideNav/SideNav.jsx';
import TopBar from '../TopBar/TopBar.jsx';
import Breadcrumb from '../../ui/Breadcrumb/Breadcrumb.jsx';
import { pageVariants } from '../../../styles/motion.js';
import styles from './MainLayout.module.css';

/** Seções da área logada: prefixo da rota → rótulo + destino no breadcrumb. */
const SECTIONS = [
  { prefix: '/projeto', label: 'Explorar', to: '/explorar' },
  { prefix: '/explorar', label: 'Explorar', to: '/explorar' },
  { prefix: '/aluno', label: 'Meus projetos', to: '/aluno' },
  { prefix: '/painel', label: 'Painel unificado', to: '/painel' },
  { prefix: '/perfil', label: 'Perfil', to: '/perfil' },
  { prefix: '/secretaria', label: 'Cursos', to: '/secretaria/cursos' },
  { prefix: '/ajuda', label: 'Ajuda e suporte', to: '/ajuda' },
];

/**
 * 3ª linha conversacional do breadcrumb (rota exata) — nos protótipos ela
 * repete o título da página ("PI² / Meus projetos / Minhas ideias em ação.").
 */
const CRUMB_TITLES = {
  '/explorar': 'Ideias de todos. Inspiração para você.',
  '/aluno': 'Minhas ideias em ação.',
};

/** Saudação do painel — MESMO texto do h1 do StaffPanelPage por face. */
function painelTitleFor(user, isRole) {
  const who = user?.displayName ?? user?.name ?? '';
  const professor = isRole('professor');
  const coordenador = isRole('coordenador');
  if (professor && coordenador) return `Olá, ${who}. Você orienta e coordena.`;
  if (professor) return `Olá, ${who}. Vamos orientar ideias?`;
  if (coordenador) return 'Olá, coordenador(a). Vamos acompanhar o PI?';
  return null;
}

export default function MainLayout({ barVariant = 'brand', title, action }) {
  const { user, spaceLabel, isRole } = useAuth();
  const location = useLocation();
  const outlet = useOutlet();

  /** Breadcrumb: PI² / seção da rota / título conversacional (como no mockup). */
  const crumbs = useMemo(() => {
    const list = [{ label: 'PI²', to: '/' }];
    const section = SECTIONS.find((s) => location.pathname.startsWith(s.prefix));
    if (section) list.push({ label: section.label, to: section.to });
    const third =
      CRUMB_TITLES[location.pathname] ??
      (location.pathname === '/painel' ? painelTitleFor(user, isRole) : null) ??
      (barVariant === 'stack' && title ? title : null);
    if (third) list.push({ label: third });
    return list;
  }, [location.pathname, barVariant, title, user, isRole]);

  return (
    <div className={styles.shell}>
      {/* barra de fora a fora no topo (acima da SideNav no desktop) */}
      <TopBar
        variant={barVariant}
        title={title}
        action={action}
        spaceLabel={spaceLabel}
        user={user}
      />
      <div className={styles.body}>
        <SideNav user={user} />
        <AnimatePresence mode="wait">
          {/* key por rota → a tela sai suave e a próxima entra sem reanimar as barras */}
          <motion.main key={location.pathname} className={styles.stage} {...pageVariants}>
            <Breadcrumb crumbs={crumbs} />
            {outlet}
            <footer className={styles.footer}>
              <span>PI² · Ideias que multiplicam conhecimento</span>
              <span className={styles.footerLinks}>Privacidade · Termos de uso</span>
            </footer>
          </motion.main>
        </AnimatePresence>
      </div>
      <BottomNav user={user} />
    </div>
  );
}
