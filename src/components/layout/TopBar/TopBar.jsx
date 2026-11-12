/**
 * PI² — Barra superior da área logada.
 * Duas variantes:
 *  • "brand": logo + marca/espaço + usuário — no desktop (≥1024px) ganha
 *    o título "Conhecimento conectado", o chip do semestre e o bloco
 *    nome/papel com chevron (como nos protótipos desktop);
 *  • "stack": botão voltar + título central + ação à direita (detalhes).
 * O TopBar NÃO re-anima entre rotas: a animação de entrada é só do conteúdo
 * (aplicada no MainLayout).
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBell,
  FiChevronDown,
  FiMoreHorizontal,
} from 'react-icons/fi';
import Logo from '../../icons/Logo.jsx';
import { LOGIN_PROFILES } from '../../../mocks/usersMock.js';
import styles from './TopBar.module.css';

/** Período letivo exibido no cabeçalho desktop (mock). */
const SEMESTER_LABEL = '2026.2';

/** Notificações simuladas do sininho (mock — sem backend). */
const NOTIFICATIONS = [
  { id: 'n1', text: 'Seu projeto foi aprovado e publicado na vitrine.', when: 'Hoje, 09:12' },
  { id: 'n2', text: 'Orientador comentou em "Biblioteca Conectada".', when: 'Ontem, 18:40' },
  { id: 'n3', text: '2 entregáveis aguardando revisão.', when: '05 out.' },
];

/**
 * Rótulo de papel no bloco do usuário (ex.: "Aluno",
 * "Coordenador e professor" quando atua nos dois espaços).
 */
function roleLabelFor(user) {
  const roles = user?.roles ?? [];
  if (roles.includes('professor') && roles.includes('coordenador')) {
    return 'Coordenador e professor';
  }
  return LOGIN_PROFILES.find((p) => p.role === roles[0])?.label ?? '';
}

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

  /* Sininho: abre/fecha o painel de notificações (fecha ao clicar fora). */
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  useEffect(() => {
    if (!bellOpen) return undefined;
    const handleOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [bellOpen]);

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

  /* No mobile o espaço do aluno é a própria marca ("Conhecimento conectado");
     no desktop o cabeçalho tem 2 linhas — marca em cima, espaço embaixo. */
  const spaceSubtitle =
    spaceLabel === 'Conhecimento conectado' ? 'Espaço do aluno' : spaceLabel;

  return (
    <header className={styles.brand}>
      <Logo size={44} className={styles.logo} />
      <div className={styles.brandBlock}>
        <strong className={styles.brandTitle}>Conhecimento conectado</strong>
        <span className={styles.spaceLabel}>{spaceSubtitle}</span>
      </div>
      <span className={styles.semester}>{SEMESTER_LABEL}</span>
      <div className={styles.bellWrap} ref={bellRef}>
        <button
          type="button"
          className={styles.bell}
          onClick={() => setBellOpen((open) => !open)}
          aria-label="Notificações"
          aria-expanded={bellOpen}
        >
          <FiBell size={20} aria-hidden="true" />
          <span className={styles.bellDot} aria-hidden="true" />
        </button>
        {bellOpen && (
          <div className={styles.bellPop}>
            <p className={styles.bellTitle}>Notificações</p>
            <ul className={styles.bellList}>
              {NOTIFICATIONS.map((item) => (
                <li key={item.id} className={styles.bellItem}>
                  <span className={styles.bellText}>{item.text}</span>
                  <time className={styles.bellWhen}>{item.when}</time>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        type="button"
        className={styles.user}
        onClick={() => navigate('/perfil')}
        aria-label={`Perfil de ${user?.name ?? 'usuário'}`}
      >
        <span className={styles.avatar}>{user?.initials ?? '—'}</span>
        <span className={styles.userBlock}>
          <strong className={styles.userName}>{user?.name ?? ''}</strong>
          <span className={styles.userRole}>{roleLabelFor(user)}</span>
        </span>
        <FiChevronDown className={styles.chevron} size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
