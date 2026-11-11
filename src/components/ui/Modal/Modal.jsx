/**
 * PI² — Modal / Bottom Sheet (fundo escurecido + painel deslizante).
 * No mobile abre como bottom sheet (como nos protótipos de filtros);
 * no desktop centraliza. Feche pelo botão X, pelo overlay ou Esc.
 * Entrada (fade + subida) e SAÍDA (fade + descida) via framer-motion:
 * o AnimatePresence é INTERNO — quem usa o componente não muda nada.
 */
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          className={styles.overlay}
          role="presentation"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25, ease: 'ease' }}
        >
          <motion.div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25, ease: 'ease' }}
          >
            <div className={styles.grabber} />
            <header className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Fechar"
              >
                <FiX size={22} aria-hidden="true" />
              </button>
            </header>
            <div className={styles.body}>{children}</div>
            {footer && <footer className={styles.footer}>{footer}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
