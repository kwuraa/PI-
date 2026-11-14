/**
 * PI² — Barra superior da área logada.
 * Duas variantes:
 *  • "brand": logo + marca/espaço + usuário — no desktop (≥1024px) ganha
 *    o título "Conhecimento conectado", o chip do semestre e o bloco
 *    nome/papel com chevron (como nos protótipos desktop);
 *  • "stack": botão voltar + título central + ação à direita (detalhes).
 * O TopBar NÃO re-anima entre rotas: a animação de entrada é só do conteúdo
 * (aplicada no MainLayout).
 * Caixinhas do topo: o bloco do usuário abre o menu de perfil (espaço ativo,
 * Meu perfil, ajuda e sair) e o "..." da variante "stack" abre as ações da
 * página — as duas (e o sininho) ficam mutuamente exclusivas e fecham ao
 * clicar fora.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBell,
  FiCheck,
  FiChevronDown,
  FiHelpCircle,
  FiLink2,
  FiLogOut,
  FiMoreHorizontal,
  FiUser,
} from 'react-icons/fi';
import Logo from '../../icons/Logo.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
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
  const { activeRoles, spaceOptions, logout, switchSpace } = useAuth();

  /* Caixinhas do topo (sininho, perfil e "..."): só uma aberta por vez,
     fechando ao clicar fora — o sininho já funcionava assim; agora o
     bloco do usuário e o "..." compartilham o mesmo estado. */
  const [openPop, setOpenPop] = useState(null); // 'bell' | 'user' | 'more'
  const bellRef = useRef(null);
  const userRef = useRef(null);
  const moreRef = useRef(null);
  useEffect(() => {
    if (!openPop) return undefined;
    const ref = { bell: bellRef, user: userRef, more: moreRef }[openPop];
    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenPop(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openPop]);

  /* "Copiar link": 2s de feedback enquanto a caixinha continua aberta. */
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  /** Copia a URL atual e deixa o item mostrar "Link copiado!". */
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
  };

  /** Sair da conta: encerra a sessão simulada e volta para a home. */
  const handleLogout = () => {
    logout();
    setOpenPop(null);
    navigate('/', { replace: true });
  };

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
            <div className={styles.moreWrap} ref={moreRef}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Mais opções"
                aria-haspopup="menu"
                aria-expanded={openPop === 'more'}
                onClick={() => setOpenPop((pop) => (pop === 'more' ? null : 'more'))}
              >
                <FiMoreHorizontal size={22} aria-hidden="true" />
              </button>
              {openPop === 'more' && (
                <div className={styles.morePop} role="menu">
                  <button
                    type="button"
                    className={styles.popItem}
                    role="menuitem"
                    onClick={() => {
                      setOpenPop(null);
                      navigate('/perfil');
                    }}
                  >
                    <FiUser aria-hidden="true" />
                    Meu perfil
                  </button>
                  <button
                    type="button"
                    className={styles.popItem}
                    role="menuitem"
                    onClick={handleCopyLink}
                  >
                    <FiLink2 aria-hidden="true" />
                    {copied ? 'Link copiado!' : 'Copiar link'}
                  </button>
                  <button
                    type="button"
                    className={styles.popItem}
                    role="menuitem"
                    onClick={() => {
                      setOpenPop(null);
                      navigate('/ajuda');
                    }}
                  >
                    <FiHelpCircle aria-hidden="true" />
                    Ajuda e suporte
                  </button>
                  <span className={styles.popDivider} aria-hidden="true" />
                  <button
                    type="button"
                    className={`${styles.popItem} ${styles.popDanger}`}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <FiLogOut aria-hidden="true" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
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
          onClick={() => setOpenPop((pop) => (pop === 'bell' ? null : 'bell'))}
          aria-label="Notificações"
          aria-expanded={openPop === 'bell'}
        >
          <FiBell size={20} aria-hidden="true" />
          <span className={styles.bellDot} aria-hidden="true" />
        </button>
        {openPop === 'bell' && (
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
      <div className={styles.userWrap} ref={userRef}>
        <button
          type="button"
          className={styles.user}
          aria-haspopup="menu"
          aria-expanded={openPop === 'user'}
          aria-label={`Menu de ${user?.name ?? 'usuário'}`}
          onClick={() => setOpenPop((pop) => (pop === 'user' ? null : 'user'))}
        >
          <span className={styles.avatar}>{user?.initials ?? '—'}</span>
          <span className={styles.userBlock}>
            <strong className={styles.userName}>{user?.name ?? ''}</strong>
            <span className={styles.userRole}>{roleLabelFor(user)}</span>
          </span>
          <FiChevronDown className={styles.chevron} size={20} aria-hidden="true" />
        </button>
        {openPop === 'user' && (
          <div className={styles.userPop} role="menu">
            {/* multiperfil: troca o espaço ativo (mesmo seletor do login) */}
            {spaceOptions && (
              <>
                <p className={styles.popSection}>Espaço</p>
                {spaceOptions.map((option) => {
                  const isActive =
                    option.roles.join(',') === (activeRoles ?? []).join(',');
                  return (
                    <button
                      key={option.roles.join('-')}
                      type="button"
                      role="menuitem"
                      className={isActive ? styles.popItemActive : styles.popItem}
                      onClick={() => {
                        switchSpace(option.roles);
                        setOpenPop(null);
                      }}
                    >
                      {option.label}
                      {isActive && <FiCheck aria-hidden="true" />}
                    </button>
                  );
                })}
                <span className={styles.popDivider} aria-hidden="true" />
              </>
            )}
            <button
              type="button"
              className={styles.popItem}
              role="menuitem"
              onClick={() => {
                setOpenPop(null);
                navigate('/perfil');
              }}
            >
              <FiUser aria-hidden="true" />
              Meu perfil
            </button>
            <button
              type="button"
              className={styles.popItem}
              role="menuitem"
              onClick={() => {
                setOpenPop(null);
                navigate('/ajuda');
              }}
            >
              <FiHelpCircle aria-hidden="true" />
              Ajuda e suporte
            </button>
            <span className={styles.popDivider} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.popItem} ${styles.popDanger}`}
              role="menuitem"
              onClick={handleLogout}
            >
              <FiLogOut aria-hidden="true" />
              Sair da conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
