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
