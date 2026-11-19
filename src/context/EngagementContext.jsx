/**
 * PI² — Contexto de engajamento (visualizações e curtidas dos projetos).
 * -----------------------------------------------------------------------------
 * Simula, sem backend, as métricas públicas dos projetos:
 *  • VIEWS  → cada visita à página "/projeto/:slug" conta UMA vez por
 *    sessão do navegador (sessionStorage): recarregar (F5) não infla a
 *    contagem; abrir o projeto em outra aba/sessão conta de novo.
 *  • LIKES  → apenas usuários LOGADOS (aluno, professor, coordenador…)
 *    curtem projetos PUBLICADOS; o toggle desfaz a própria curtida. O
 *    visitante vê a contagem e o convite "Entre para curtir".
 *
 * Persistência (mock de "permanência", como a sessão do AuthContext):
 *  • `localStorage["pi2.engagement"]` → totais acumulados (views + likes);
 *  • `sessionStorage["pi2.viewed"]`   → slugs já contados NA SESSÃO.
 * Sem armazenamento disponível (modo privado), tudo segue em memória.
 *
 * Seed: os totais iniciais vêm dos campos `views`/`likes` de cada projeto
 * em `src/mocks/projectsMock.js` — edite os números lá para o "estado
 * inicial" do protótipo.
 *
 * Uso em qualquer componente:
 *   const { viewsFor, likesFor, hasLiked, registerView, toggleLike } =
 *     useEngagement();
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PROJECTS } from '../mocks/projectsMock.js';

const EngagementContext = createContext(null);

/** Chaves de persistência (mock de "banco" do protótipo). */
const STORE_KEY = 'pi2.engagement';
const VIEWED_KEY = 'pi2.viewed';

/** Seed de views/likes a partir dos campos do mock (slug → número). */
const SEED_VIEWS = Object.fromEntries(
  PROJECTS.map((project) => [project.slug, project.views ?? 0])
);
const SEED_LIKES = Object.fromEntries(
  PROJECTS.map((project) => [project.slug, project.likes ?? 0])
);

/** Lê os totais persistidos (localStorage) com fallback ao estado vazio. */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          views: parsed.views ?? {},
          likedBy: parsed.likedBy ?? {},
        };
      }
    }
  } catch {
    /* localStorage indisponível (modo privado, etc.) — segue em memória */
  }
  return { views: {}, likedBy: {} };
}

/** Lê os slugs já contados NA SESSÃO (sessionStorage) como lista. */
function loadViewed() {
  try {
    const raw = sessionStorage.getItem(VIEWED_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list.filter((item) => typeof item === 'string');
    }
  } catch {
    /* sessionStorage indisponível — segue em memória */
  }
  return [];
}

export function EngagementProvider({ children }) {
  const [store, setStore] = useState(loadStore);
  /** Set em memória: guarda IMEDIATO contra o duplo-mount do StrictMode
   *  (o estado assíncrono ainda não refletiria a primeira chamada). */
  const viewedRef = useRef(new Set(loadViewed()));

  /* Persiste os totais a cada mudança (views contadas e likes). */
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch {
      /* falha de armazenamento não pode quebrar o app */
    }
  }, [store]);

  /** Views do projeto = seed do mock + incrementos persistidos. */
  const viewsFor = useCallback(
    (slug) => store.views[slug] ?? SEED_VIEWS[slug] ?? 0,
    [store.views]
  );

  /** Curtidas = seed do mock + usuários que curtiram (likedBy). */
  const likesFor = useCallback(
    (slug) => (SEED_LIKES[slug] ?? 0) + (store.likedBy[slug]?.length ?? 0),
    [store.likedBy]
  );

  /** O usuário logado já curtiu este projeto? */
  const hasLiked = useCallback(
    (slug, userId) => Boolean(userId && store.likedBy[slug]?.includes(userId)),
    [store.likedBy]
  );

  /**
   * Registra UMA view por sessão do navegador: o Set em memória (ref)
   * bloqueia chamadas repetidas no mesmo carregamento (StrictMode roda o
   * effect duas vezes); a persistência no sessionStorage mantém a regra
   * ao recarregar (F5) e zera ao fechar a aba/visita nova.
   */
  const registerView = useCallback((slug) => {
    if (!slug || viewedRef.current.has(slug)) return;
    viewedRef.current.add(slug);
    try {
      sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...viewedRef.current]));
    } catch {
      /* sem sessionStorage, a proteção segue valendo na memória */
    }
    setStore((prev) => ({
      ...prev,
      views: {
        ...prev.views,
        [slug]: (prev.views[slug] ?? SEED_VIEWS[slug] ?? 0) + 1,
      },
    }));
  }, []);

  /** Alterna a curtida do usuário logado (adiciona ou remove o userId). */
  const toggleLike = useCallback((slug, userId) => {
    if (!slug || !userId) return;
    setStore((prev) => {
      const current = prev.likedBy[slug] ?? [];
      const liked = current.includes(userId);
      return {
        ...prev,
        likedBy: {
          ...prev.likedBy,
          [slug]: liked
            ? current.filter((id) => id !== userId)
            : [...current, userId],
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({ viewsFor, likesFor, hasLiked, registerView, toggleLike }),
    [viewsFor, likesFor, hasLiked, registerView, toggleLike]
  );

  return (
    <EngagementContext.Provider value={value}>
      {children}
    </EngagementContext.Provider>
  );
}

/** Hook de acesso ao contexto de engajamento. */
export function useEngagement() {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error('useEngagement deve ser usado dentro de <EngagementProvider>.');
  }
  return ctx;
}
