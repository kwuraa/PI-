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
