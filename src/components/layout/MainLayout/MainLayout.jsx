/**
 * PI² — Shell da área logada: TopBar + conteúdo + BottomNav persistente.
 * -----------------------------------------------------------------------------
 * Regra de animação: a entrada/saída do conteúdo acontece APENAS no <main>
 * (stage), com framer-motion (AnimatePresence mode="wait" + `key` por rota).
 * TopBar e BottomNav ficam fora do stage e, por isso, NÃO re-animam entre
 * rotas. Espaço inferior reservado para a BottomNav fixa.
 *
 * Props:
 *  • barVariant: 'brand' | 'stack' (como a barra superior se apresenta)
 *  • title / action: usados na variante 'stack'
 */
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '../../../context/AuthContext.jsx';
import BottomNav from '../BottomNav/BottomNav.jsx';
import TopBar from '../TopBar/TopBar.jsx';
import { pageVariants } from '../../../styles/motion.js';
import styles from './MainLayout.module.css';

export default function MainLayout({ barVariant = 'brand', title, action }) {
  const { user, spaceLabel } = useAuth();
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className={styles.shell}>
      <TopBar
        variant={barVariant}
        title={title}
        action={action}
        spaceLabel={spaceLabel}
        user={user}
      />
      <AnimatePresence mode="wait">
        {/* key por rota → a tela sai suave e a próxima entra sem reanimar as barras */}
        <motion.main key={location.pathname} className={styles.stage} {...pageVariants}>
          {outlet}
        </motion.main>
      </AnimatePresence>
      <BottomNav user={user} />
    </div>
  );
}
