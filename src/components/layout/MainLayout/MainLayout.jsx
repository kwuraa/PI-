import { useMemo } from 'react';
import { Link, useLocation, useOutlet, useSearchParams } from 'react-router-dom';
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
  { prefix: '/alterar-senha', label: 'Perfil', to: '/perfil' },
  { prefix: '/secretaria', label: 'Cursos', to: '/secretaria/cursos' },
  { prefix: '/ajuda', label: 'Ajuda e suporte', to: '/ajuda' },
];

/**
 * 3ª linha conversacional do breadcrumb (rota exata) — ela
 * repete o título da página ("PI² / Meus projetos / Minhas ideias em ação.").
 * Rotas parametrizadas (com :slug) não cabem aqui: ver `crumbForRota`.
 */
const CRUMB_TITLES = {
  '/explorar': 'Explorar projetos',
  '/aluno': 'Minhas ideias em ação.',
  '/aluno/novo': 'Novo projeto',
  '/perfil': 'Meu perfil',
  '/alterar-senha': 'Alterar senha',
  '/painel/relatorio-consolidado': 'Relatório consolidado',
};

/**
 * 2ª linha do breadcrumb para rotas cuja seção própria não é "/painel"
 * ("PI² / Relatório consolidado / Relatório consolidado").
 */
const SECTION_OVERRIDES = {
  '/painel/relatorio-consolidado': {
    label: 'Relatório consolidado',
    to: '/painel/relatorio-consolidado',
  },
};

/**
 * 3ª linha de rotas PARAMETRIZADAS (o CRUMB_TITLES exato não as alcança).
 * -----------------------------------------------------------------------------
 * /aluno/status/:slug: a trilha depende da QUERY STRING —
 * useSearchParams lê `?enviado=1`, colocado pelo NewProjectPage depois do
 * envio, e então o breadcrumb vira "Enviado para análise!"; sem a query
 * (projeto em acompanhamento) ele é "Acompanhar análise".
 * @param {string} pathname rota atual (ex.: "/aluno/status/ecocampus")
 * @param {URLSearchParams} search query string da rota
 * @returns {string|null} título da 3ª linha ou null (sem regra própria)
 */
function crumbForRota(pathname, search) {
  if (!pathname.startsWith('/aluno/status/')) return null;
  return search.get('enviado') === '1'
    ? 'Enviado para análise!'
    : 'Acompanhar análise';
}

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
  // query string atual — usada pelo breadcrumb (ex.: ?enviado=1 em
  // /aluno/status/:slug → "Enviado para análise!").
  const [search] = useSearchParams();

  /** Breadcrumb: PI² / seção da rota / título conversacional. */
  const crumbs = useMemo(() => {
    const list = [{ label: 'PI²', to: '/' }];
    const section =
      SECTION_OVERRIDES[location.pathname] ??
      SECTIONS.find((s) => location.pathname.startsWith(s.prefix));
    if (section) list.push({ label: section.label, to: section.to });
    const third =
      CRUMB_TITLES[location.pathname] ??
      crumbForRota(location.pathname, search) ??
      (location.pathname === '/painel' ? painelTitleFor(user, isRole) : null) ??
      (barVariant === 'stack' && title ? title : null);
    if (third) list.push({ label: third });
    return list;
  }, [location.pathname, search, barVariant, title, user, isRole]);

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
            <footer className={styles.footer} data-print-hide>
              <span>PI² · Ideias que multiplicam conhecimento</span>
              <span className={styles.footerLinks}>
                <Link to="/privacidade">Privacidade</Link>
                {' · '}
                <Link to="/termos">Termos de uso</Link>
              </span>
            </footer>
          </motion.main>
        </AnimatePresence>
      </div>
      <BottomNav user={user} />
    </div>
  );
}
