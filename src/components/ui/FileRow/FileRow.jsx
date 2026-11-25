/**
 * PI² — Linha de arquivo da entrega (nome + metadados + ação).
 * -----------------------------------------------------------------------------
 * Unifica as 5 reimplementações espalhadas pelas telas (ProjectPage,
 * DeliveryPage, ProfessorProjectPage, ReviewPage, ProjectStatusPage),
 * que divergiam em nomes de classe (`fileText` x `fileTexts`), no elemento
 * (`<li>` x `<div>`) e no ícone.
 *
 * Props:
 *  • name     → nome do arquivo (obrigatório);
 *  • meta     → linha secundária (ex.: "PDF · 2,4 MB · v3");
 *  • icon     → 'plain' (só cor) | 'circle' (pílula 40px) |
 *               'square' (quadradinho radius-md) | 'square-sm' (radius-sm);
 *  • action   → 'icon' (decorativo, padrão do protótipo) |
 *               'download' (botão com aria-label "Baixar …") | nó | null;
 *  • as       → 'li' (padrão) | 'div' | 'a' (com href, ganha hover);
 *  • variant  → 'surface' (branco) | 'page' (cinza) | 'bare' (só borda);
 *  • dense    → padding lateral menor (12px em vez de 16px);
 *  • truncate → corta o nome com reticências (linha única);
 *  • size     → tamanho dos ícones (ex.: 18 no status do aluno).
 *
 * Uso:
 *   <FileRow name={file.name} meta={`${file.kind} · ${file.size}`}
 *            icon="circle" action="download" variant="page" dense truncate />
 */
import { FiDownload } from 'react-icons/fi';

import LeadingIcon from './LeadingIcon.jsx';
import styles from './FileRow.module.css';

export default function FileRow({
  name,
  meta = null,
  icon = 'plain',
  action = 'icon',
  as: Tag = 'li',
  href,
  variant = 'surface',
  dense = false,
  truncate = false,
  size,
  className = '',
  ...rest
}) {
  /** Ação à direita: botão de download, ícone decorativo ou nó próprio. */
  const trailing =
    action === 'download' ? (
      <button
        type="button"
        className={
          size ? `${styles.download} ${styles.downloadSm}` : styles.download
        }
        aria-label={`Baixar ${name}`}
      >
        <FiDownload aria-hidden="true" {...(size ? { size } : {})} />
      </button>
    ) : action === 'icon' ? (
      <FiDownload
        className={styles.trailingIcon}
        aria-hidden="true"
        {...(size ? { size } : {})}
      />
    ) : (
      action
    );

  const classes = [
    styles.row,
    styles[variant],
    dense && styles.dense,
    Tag === 'a' && styles.link,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...(Tag === 'a' ? { href } : {})} {...rest}>
      <LeadingIcon variant={icon} size={size} />
      <span className={styles.texts}>
        <strong className={truncate ? styles.nameTruncate : styles.name}>
          {name}
        </strong>
        {meta ? <small className={styles.meta}>{meta}</small> : null}
      </span>
      {trailing}
    </Tag>
  );
}
