/**
 * PI² — Contexto de autenticação e RBAC (simulado).
 * -----------------------------------------------------------------------------
 * Simula login/logout trocando o "usuário ativo" em memória (sem backend).
 * O perfil escolhido na tela de login define os roles, e as rotas protegidas
 * consultam useAuth() para decidir quem pode ver o quê.
 *
 * Sessão persistida: o par (usuário, roles ativos) fica salvo em
 * localStorage — atualizar a página NÃO desloga mais (id do usuário +
 * roles; o objeto em si é reidratado dos mocks).
 *
 * Espaço ativo (troca de perfis): um usuário com mais de um role (ex.:
 * professor que também coordena) pode atuar em um espaço por vez —
 * `activeRoles` define o que vale AGORA (cabeçalho, guardas e painel).
 *
 * Uso em qualquer componente:
 *   const { user, activeRoles, isRole, login, logout, switchSpace } = useAuth();
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  MOCK_USERS,
  spaceLabelFor,
  spaceOptionsFor,
} from '../mocks/usersMock.js';

const AuthContext = createContext(null);

/** Chave da sessão persistida no navegador (mock de "permanência"). */
const SESSION_KEY = 'pi2.session';

/** Lê a sessão salva e a reidrata com os mocks (id + roles válidos). */
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { userId, roles } = JSON.parse(raw);
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (!found || !Array.isArray(roles)) return null;
    const validRoles = roles.filter((r) => found.roles.includes(r));
    return validRoles.length > 0 ? { user: found, roles: validRoles } : null;
  } catch {
    return null; /* localStorage indisponível (modo privado, etc.) */
  }
}

export function AuthProvider({ children }) {
  const [session] = useState(loadSession);
  const [user, setUser] = useState(session?.user ?? null);
  const [activeRoles, setActiveRoles] = useState(session?.roles ?? null);

  /* Persiste a sessão a cada troca (login, logout ou troca de espaço). */
  useEffect(() => {
    try {
      if (user && activeRoles) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ userId: user.id, roles: activeRoles })
        );
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      /* falha de armazenamento não pode quebrar o app */
    }
  }, [user, activeRoles]);

  /**
   * Faz login com o perfil do role escolhido.
   * Prefere usuário cujo papel é exatamente o escolhido (evita cair num
   * usuário multiperfil quando existe um dedicado), e ativa o espaço padrão.
   */
  const login = useCallback((role) => {
    const exact = MOCK_USERS.find((u) => u.roles.length === 1 && u.roles[0] === role);
    const found = exact ?? MOCK_USERS.find((u) => u.roles.includes(role)) ?? MOCK_USERS[0];
    setUser(found);
    setActiveRoles(found.defaultRoles ?? [role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveRoles(null);
  }, []);

  /** Verifica se o espaço ATUAL do usuário logado tem um role específico. */
  const isRole = useCallback(
    (role) => Boolean(activeRoles && activeRoles.includes(role)),
    [activeRoles]
  );

  /** Troca o espaço ativo (deve ser um subconjunto dos roles do usuário). */
  const switchSpace = useCallback(
    (roles) => {
      if (!user) return;
      const valid = roles.filter((r) => user.roles.includes(r));
      if (valid.length > 0) setActiveRoles(valid);
    },
    [user]
  );

  /** Rótulo do espaço (cabeçalho) conforme os roles ATIVOS. */
  const spaceLabel = useMemo(
    () => (activeRoles ? spaceLabelFor(activeRoles) : ''),
    [activeRoles]
  );

  /** Opções de espaço para o seletor da tela de perfil (null = multiperfil). */
  const spaceOptions = useMemo(
    () => (user ? spaceOptionsFor(user) : null),
    [user]
  );

  const value = useMemo(
    () => ({ user, activeRoles, spaceLabel, spaceOptions, login, logout, isRole, switchSpace }),
    [user, activeRoles, spaceLabel, spaceOptions, login, logout, isRole, switchSpace]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de acesso ao contexto de autenticação. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }
  return ctx;
}
