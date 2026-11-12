/**
 * PI² — Shell das telas públicas/autenticadas sem BottomNav
 * (boas-vindas, login, cadastro, recuperação de senha).
 * Animação (framer-motion): o stage entra com fade + subida e SAÍ antes da
 * próxima tela entrar (AnimatePresence mode="wait"). O `key` por rota +
 * `useOutlet()` garantem que quem anima a saída é a tela ANTIGA; o shell
 * em si permanece estável.
 * Chrome (só desktop, ≥768px): cabeçalho e rodapé das telas de auth —
 * a boas-vindas tem os seus próprios, então fica de fora.
 */
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Logo from '../../icons/Logo.jsx';
import { pageVariants } from '../../../styles/motion.js';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const isWelcome = location.pathname === '/';

  return (
    <div className={styles.shell}>
      {!isWelcome && (
        <header className={styles.header}>
          <Link to="/" className={styles.headerBrand}>
            <Logo size={44} />
            <span className={styles.headerLabel}>Repositório acadêmico</span>
          </Link>
          <Link to="/ajuda" className={styles.headerHelp}>
            Precisa de ajuda? · Suporte institucional
          </Link>
        </header>
      )}

      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} className={styles.stage} {...pageVariants}>
          {outlet}
        </motion.main>
      </AnimatePresence>

      {!isWelcome && (
        <footer className={styles.footer}>
          <span>PI² · Ideias que multiplicam conhecimento</span>
          <span className={styles.footerLinks}>Termos de uso · Política de privacidade</span>
        </footer>
      )}
    </div>
  );
}
