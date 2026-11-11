/**
 * PI² — Shell das telas públicas/autenticadas sem BottomNav
 * (boas-vindas, acesso, login, cadastro, recuperação de senha).
 * A entrada do conteúdo usa framer-motion (`motion.main`): o stage é
 * remontado a cada navegação via `key`, então re-anima sozinho — o shell
 * em si permanece estável.
 */
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className={styles.shell}>
      <motion.main
        key={location.pathname}
        className={styles.stage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'ease' }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
