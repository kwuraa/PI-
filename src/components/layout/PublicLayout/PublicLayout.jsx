import { Link, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { pageVariants } from "../../../styles/motion.js";
import styles from "./PublicLayout.module.css";

export default function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const isWelcome = location.pathname === "/";

  return (
    <div className={styles.shell}>
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={styles.stage}
          {...pageVariants}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      {!isWelcome && (
        <footer className={styles.footer}>
          <span>PI² · Ideias que multiplicam conhecimento</span>
          <span className={styles.footerLinks}>
            <Link to="/termos">Termos de uso</Link>
            {' · '}
            <Link to="/privacidade">Política de privacidade</Link>
          </span>
        </footer>
      )}
    </div>
  );
}
