/**
 * PI² — Trilha de navegação (breadcrumb) das telas logadas.
 * -----------------------------------------------------------------------------
 * Montada pelo MainLayout a partir da rota: "PI² / seção / (título da barra
 * empilhada)". Fica no topo do stage e entra junto com a animação de
 * conteúdo da página (regra do briefing: só o stage anima).
 */
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ crumbs = [] }) {
  if (crumbs.length === 0) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Trilha de navegação">
      <ol className={styles.list}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.label} className={styles.item}>
              {index > 0 && (
                <span className={styles.sep} aria-hidden="true">
                  /
                </span>
              )}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className={styles.link}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
