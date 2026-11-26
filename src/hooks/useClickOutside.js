import { useEffect, useRef } from 'react';

export default function useClickOutside(ref, handler, enabled = true) {
  /* Guarda a versão mais recente do handler sem reanexar o listener. */
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled || !ref) return undefined;

    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [ref, enabled]);
}
