import { Compass, LayoutGrid, Bookmark, User, Layers } from '../components/icons';

/**
 * Itens da barra inferior por perfil.
 * O design mostra navegações distintas:
 *  - aluno:      Explorar · Meus projetos · Salvos · Perfil
 *  - professor:  Explorar · Painel · Salvos · Perfil
 */
export const STUDENT_NAV_ITEMS = [
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/meus-projetos', label: 'Meus projetos', icon: Layers },
  { to: '/salvos', label: 'Salvos', icon: Bookmark },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export const PROFESSOR_NAV_ITEMS = [
  { to: '/explorar', label: 'Explorar', icon: Compass },
  {
    to: '/painel',
    label: 'Painel',
    icon: LayoutGrid,
    // Telas de revisão/notas pertencem à aba "Painel"
    match: ['/painel', '/professor', '/coordenador'],
  },
  { to: '/salvos', label: 'Salvos', icon: Bookmark },
  { to: '/perfil', label: 'Perfil', icon: User },
];

// Usuário comum (sem projetos próprios): leitura pública dos projetos
export const USER_NAV_ITEMS = [
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/salvos', label: 'Salvos', icon: Bookmark },
  { to: '/perfil', label: 'Perfil', icon: User },
];

/**
 * Escolhe os itens da barra inferior conforme a rota atual.
 * Usado pelo MainLayout (a nav é persistente — vive fora das páginas).
 */
export function getNavItems(pathname) {
  // Telas do professor/coordenador: a aba "Painel" cobre /painel, /professor e /coordenador
  if (
    pathname.startsWith('/painel') ||
    pathname.startsWith('/professor') ||
    pathname.startsWith('/coordenador')
  ) {
    return PROFESSOR_NAV_ITEMS;
  }

  // Leitura pública não tem a aba "Meus projetos"
  if (pathname.startsWith('/projetos/') && pathname.endsWith('/publico')) {
    return USER_NAV_ITEMS;
  }

  // Área do aluno (meus projetos, explorar, salvos, perfil…)
  return STUDENT_NAV_ITEMS;
}
