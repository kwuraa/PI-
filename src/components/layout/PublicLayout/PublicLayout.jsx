/**
 * PI² — Shell das telas públicas/autenticadas sem BottomNav
 * (boas-vindas, login, cadastro, recuperação de senha).
 * Mantém o mesmo padrão de animação de entrada do conteúdo.
 */
import { Outlet, useLocation } from 'react-router-dom';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className={styles.shell}>
      <main key={location.pathname} className={styles.stage}>
        <Outlet />
      </main>
    </div>
  );
}
