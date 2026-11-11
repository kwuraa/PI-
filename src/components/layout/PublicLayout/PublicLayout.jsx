/**
 * PI² — Shell das telas públicas/autenticadas sem BottomNav
 * (boas-vindas, acesso, login, cadastro, recuperação de senha).
 * Animação (framer-motion): o stage entra com fade + subida e SAÍ antes da
 * próxima tela entrar (AnimatePresence mode="wait"). O `key` por rota +
 * `useOutlet()` garantem que quem anima a saída é a tela ANTIGA; o shell
 * em si permanece estável.
 */
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { pageVariants } from '../../../styles/motion.js';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className={styles.shell}>
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} className={styles.stage} {...pageVariants}>
          {outlet}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
