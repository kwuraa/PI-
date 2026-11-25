/**
 * PI² — Fecha menus/caixinhas ao clicar fora deles.
 * -----------------------------------------------------------------------------
 * Substitui o `document.addEventListener('mousedown', …)` duplicado no
 * TopBar (sininho, perfil e "...") e no MyProjectsPage (seletor "Todos"
 * e "..." do cartão): o hook anexa/desanexa o listener conforme `enabled`
 * e dispara `handler` quando o clique cai FORA do elemento da `ref`.
 *
 * `ref` pode ser uma única ref (`useRef`) — a forma usada hoje. O handler
 * vive numa ref interna, então trocar a função a cada render NÃO reanexa
 * o listener (só `ref`/`enabled` causam reanexação).
 *
 * Uso:
 *   const menuRef = useRef(null);
 *   const [open, setOpen] = useState(false);
 *   useClickOutside(menuRef, () => setOpen(false), open);
 */
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
