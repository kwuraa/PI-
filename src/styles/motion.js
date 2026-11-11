/**
 * PI² — Variantes de animação compartilhadas (framer-motion).
 * -----------------------------------------------------------------------------
 * Centraliza o "vocabulário" de movimento do app (DRY):
 *  • pageVariants  → entrada/saída das telas nos stages dos layouts;
 *  • staggerParent → container que escalona os filhos (hero, etc.);
 *  • fadeUpChild   → filho individual do stagger (fade + subida);
 *  • cardIn(index) → props de um card de grade com atraso pela posição.
 * Cores NÃO vivem aqui (regra: só tokens em variables.css) — só opacidade
 * e posição, sempre com duração espelhando --transition-base (250ms ease).
 */

/** Entrada/saída de cada tela no stage (AnimatePresence mode="wait"). */
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'ease' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'ease' } },
};

/** Container: os filhos entram em sequência (stagger). */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

/** Filho do stagger: fade + subida suave. */
export const fadeUpChild = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'ease' } },
};

/** Props de um card em grade: atraso progressivo pelo índice (teto 0.4s). */
export const cardIn = (index = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: Math.min(index * 0.06, 0.4),
      ease: 'ease',
    },
  },
});
