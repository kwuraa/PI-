import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { EASE } from '../../../styles/motion.js';
import styles from './Popover.module.css';

export default function Popover({ open, onClose, title, children, footer, className = '' }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    /** Fecha ao tocar fora do painel (e fora do gatilho que o alterna). */
    const onPointerDown = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-popover-trigger]')) return;
      onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className={`${styles.panel} ${className}`}
          role="dialog"
          aria-label={title}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Fechar filtros"
            >
              <FiX size={20} aria-hidden="true" />
            </button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
