/**
 * PI² — Estado de carregamento de uma rota assíncrona (React.lazy).
 * -----------------------------------------------------------------------------
 * As telas são carregadas por chunk (item 7: `React.lazy` em App.jsx); enquanto
 * o chunk chega, o `<Suspense>` renderiza este fallback no lugar do conteúdo.
 * É um texto centrado com `role="status"` (anuncia a leitores de tela) — sem
 * animação, para não depender de motion nem quebrar `prefers-reduced-motion`.
 *
 * Uso (dentro do App):
 *   <Suspense fallback={<RouteFallback />}><Routes>…</Routes></Suspense>
 */
import styles from './RouteFallback.module.css';

export default function RouteFallback() {
  return (
    <p className={styles.fallback} role="status" aria-live="polite">
      Carregando…
    </p>
  );
}
