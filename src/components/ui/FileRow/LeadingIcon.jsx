/**
 * PI² — Ícone da esquerda do FileRow, conforme a variante pedida.
 * -----------------------------------------------------------------------------
 * Extraído de FileRow.jsx na separação "um componente por arquivo" (item 6).
 *
 * Variantes:
 *  • 'circle'      → pílula 40px com o ícone centrado (arquivos do projeto);
 *  • 'square'      → quadradinho com radius-md (materiais do professor);
 *  • 'square-sm'   → quadradinho com radius-sm (arquivo enviado do aluno);
 *  • 'plain'       → só o ícone na cor primária (padrão do protótipo).
 *
 * `size` (opcional) repassa o tamanho ao ícone do react-icons.
 *
 * Uso (dentro do FileRow):
 *   <LeadingIcon variant={icon} size={size} />
 */
import { FiFileText } from 'react-icons/fi';

import styles from './LeadingIcon.module.css';

export default function LeadingIcon({ variant, size }) {
  const props = { 'aria-hidden': 'true', ...(size ? { size } : {}) };

  if (variant === 'circle') {
    return (
      <span className={styles.iconCircle}>
        <FiFileText {...props} />
      </span>
    );
  }
  if (variant === 'square' || variant === 'square-sm') {
    return (
      <span
        className={variant === 'square' ? styles.iconSquare : styles.iconSquareSm}
      >
        <FiFileText {...props} />
      </span>
    );
  }
  return <FiFileText className={styles.iconPlain} {...props} />;
}
