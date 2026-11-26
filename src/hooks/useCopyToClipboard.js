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
