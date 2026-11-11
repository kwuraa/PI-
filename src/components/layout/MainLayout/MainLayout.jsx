/**
 * PI² — Shell da área logada: TopBar + conteúdo + BottomNav persistente.
 * -----------------------------------------------------------------------------
 * Regra de animação: a entrada suave acontece APENAS no <main> (stage),
 * que é remontado a cada navegação. O TopBar fica fora do stage e, por
 * isso, NÃO re-anima entre rotas. Espaço inferior reservado para a
 * BottomNav fixa.
 *
 * Props:
 *  • barVariant: 'brand' | 'stack' (como a barra superior se apresenta)
 *  • title / action: usados na variante 'stack'
 */
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import BottomNav from '../BottomNav/BottomNav.jsx';
import TopBar from '../TopBar/TopBar.jsx';
import styles from './MainLayout.module.css';

export default function MainLayout({ barVariant = 'brand', title, action }) {
  const { user, spaceLabel } = useAuth();
  const location = useLocation();

  return (
    <div className={styles.shell}>
      <TopBar
        variant={barVariant}
        title={title}
        action={action}
        spaceLabel={spaceLabel}
        user={user}
      />
      {/* key por rota → o conteúdo re-entra suave a cada navegação */}
      <main key={location.pathname} className={styles.stage}>
        <Outlet />
      </main>
      <BottomNav user={user} />
    </div>
  );
}
