/**
 * PI² — Copia texto para a área de transferência com feedback temporário.
 * -----------------------------------------------------------------------------
 * Substitui o par "useState(copied) + useEffect(setTimeout 2s)" duplicado
 * no TopBar ("Copiar link") e no MyProjectsPage (copiar link de cada
 * cartão). `copy(text)` copia e liga `copied` pelo `timeout`; o timer é
 * limpo no unmount e reiniciado a cada nova cópia.
 *
 * `copied` guarda o TEXTO copiado (não um boolean) — assim um mesmo hook
 * atende os dois usos:
 *   • TopBar:     `copied ? 'Link copiado!' : 'Copiar link'`
 *   • MyProjects: `copied === project.slug ? … : …` (feedback por card)
 *
 * `navigator.clipboard` pode não existir (contexto não seguro) — o opt
 * `?.` mantém o feedback sem quebrar a tela.
 *
 * Uso:
 *   const { copied, copy } = useCopyToClipboard();
 *   copy(window.location.href);
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(null);
  const timerRef = useRef(null);

  /* Limpa o timer pendente no unmount (não vaza setTimeout). */
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  /** Copia `text` e mostra o feedback por `timeout` ms. */
  const copy = useCallback(
    (text) => {
      navigator.clipboard?.writeText(text);
      setCopied(text);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(null), timeout);
    },
    [timeout]
  );

  return { copied, copy };
}
