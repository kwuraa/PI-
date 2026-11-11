/**
 * PI² — Barra superior da área logada.
 * Duas variantes:
 *  • "brand": logo + rótulo do espaço + avatar (painéis e listas);
 *  • "stack": botão voltar + título central + ação à direita (detalhes).
 * O TopBar NÃO re-anima entre rotas: a animação de entrada é só do conteúdo
 * (aplicada no MainLayout).
 */
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMoreHorizontal } from 'react-icons/fi';
import Logo from '../../icons/Logo.jsx';
import styles from './TopBar.module.css';

export default function TopBar({
  variant = 'brand',
  title,
  spaceLabel,
  user,
  action = null,
  onBack,
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  if (variant === 'stack') {
    return (
      <header className={styles.stack}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={handleBack}
          aria-label="Voltar"
        >
          <FiArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className={styles.stackTitle}>{title}</h1>
        <div className={styles.actionSlot}>
          {action ?? (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Mais opções"
            >
              <FiMoreHorizontal size={22} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.brand}>
      <Logo size={44} className={styles.logo} />
      <span className={styles.spaceLabel}>{spaceLabel}</span>
      <button
        type="button"
        className={styles.avatar}
        onClick={() => navigate('/perfil')}
        aria-label={`Perfil de ${user?.name ?? 'usuário'}`}
      >
        {user?.initials ?? '—'}
      </button>
    </header>
  );
}
