/**
 * PI² — Navegação lateral do desktop (≥1024px), da área logada.
 * -----------------------------------------------------------------------------
 * Versão vertical da BottomNav: reutiliza os MESMOS destinos (`itemsFor`),
 * com pílula vermelha no item ativo. Professores/coordenadores ganham o
 * grupo "Área acadêmica" (Meus critérios, Histórico e evolução do grupo e
 * Trabalhos enviados); a coordenação ganha também o grupo "Coordenação"
 * (Relatório consolidado + Gestão de grupos) e o rodapé traz Ajuda e suporte
 * + assinatura. Abaixo de 1024px ela fica oculta (a BottomNav assume o
 * lugar); ela NÃO re-anima entre rotas (regra do briefing).
 */
import { NavLink, Link } from 'react-router-dom';
import {
  FiCheckSquare,
  FiFileText,
  FiFolder,
  FiSliders,
  FiTrendingUp,
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx';
import { itemsFor } from '../BottomNav/BottomNav.jsx';
import styles from './SideNav.module.css';

/**
 * Item de grupo com pílula vermelha quando a rota está ativa.
 * Recebe o objeto `{ isActive }` que o NavLink passa ao className.
 */
function groupItemClass({ isActive }) {
  return `${styles.item} ${isActive ? styles.active : ''}`;
}

export default function SideNav({ user }) {
  const { isRole } = useAuth();
  const items = itemsFor(user);
  const isStaff = Boolean(user) && (isRole('professor') || isRole('coordenador'));
  const isCoord = Boolean(user) && isRole('coordenador');
  // /painel/criterios é exclusiva do professor (RBAC do App.jsx): o link só
  // aparece para quem consegue abri-la — coordenação pura seria redirecionada.
  const isProfessor = Boolean(user) && isRole('professor');

  return (
    <aside className={styles.side} aria-label="Navegação lateral">
      <nav className={styles.nav}>
        {items.map(({ to, Icon, label }) => (
          // "Painel" só acende na rota exata (nos mockups, /painel/* mantém o
          // ativo no item do grupo). "Meus projetos" NÃO usa `end`: ele
          // continua ativo em /aluno/novo e /aluno/status/* — o mockup 03
          // mostra o item ativo nessas telas do aluno.
          <NavLink
            key={to}
            to={to}
            end={to === '/painel'}
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

        {isCoord && (
          <div className={styles.group}>
            <p className={styles.groupLabel}>Coordenação</p>
            <NavLink
              to="/painel/relatorio-consolidado"
              className={groupItemClass}
            >
              <span className={styles.icon}>
                <FiFileText size={20} aria-hidden="true" />
              </span>
              Relatório consolidado
            </NavLink>
            <NavLink to="/painel/grupos" className={groupItemClass}>
              <span className={styles.icon}>
                <FiSliders size={20} aria-hidden="true" />
              </span>
              Gestão de grupos
            </NavLink>
          </div>
        )}

        {isStaff && (
          <div className={styles.group}>
            <p className={styles.groupLabel}>Área acadêmica</p>
            {isProfessor && (
              <NavLink to="/painel/criterios" className={groupItemClass}>
                <span className={styles.icon}>
                  <FiCheckSquare size={20} aria-hidden="true" />
                </span>
                Meus critérios
              </NavLink>
            )}
            <NavLink to="/painel/evolucao" className={groupItemClass}>
              <span className={styles.icon}>
                <FiTrendingUp size={20} aria-hidden="true" />
              </span>
              Histórico e evolução do grupo
            </NavLink>
            <NavLink to="/painel/entregas" className={groupItemClass}>
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
