/**
 * PI² — Shell da área logada: TopBar + conteúdo + BottomNav persistente.
 * -----------------------------------------------------------------------------
 * Regra de animação: a entrada suave acontece APENAS no <main> (stage),
 * implementada com framer-motion (`motion.main`) e remontada a cada
 * navegação via `key`. O TopBar e a BottomNav ficam fora do stage e, por
 * isso, NÃO re-animam entre rotas. Espaço inferior reservado para a
 * BottomNav fixa.
 *
 * Props:
 *  • barVariant: 'brand' | 'stack' (como a barra superior se apresenta)
 *  • title / action: usados na variante 'stack'
 */
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <motion.main
        key={location.pathname}
        className={styles.stage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'ease' }}
      >
        <Outlet />
      </motion.main>
      <BottomNav user={user} />
    </div>
  );
}
