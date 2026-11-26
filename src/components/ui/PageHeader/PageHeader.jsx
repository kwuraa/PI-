import styles from './PageHeader.module.css';

/** Converte a prop de gap ('sm'|'md'|'lg') na classe do módulo. */
function gapClass(gap) {
  return { sm: styles.gapSm, md: styles.gapMd, lg: styles.gapLg }[gap];
}

export default function PageHeader({
  eyebrow = null,
  caps = false,
  title,
  lead = null,
  actions = null,
  actionsTop = false,
  gap = 'md',
  actionsGap = null,
  titleLine = 'tight',
  leadNarrow = false,
  split = null,
  titleAs: TitleTag = 'h1',
  className = '',
  ...rest
}) {
  /* Eyebrow: nó pronto (Badge) ou string → pill do cabeçalho. */
  const eyebrowNode =
    typeof eyebrow === 'string' ? (
      <span className={caps ? styles.eyebrowCaps : styles.eyebrow}>
        {eyebrow}
      </span>
    ) : (
      eyebrow
    );

  const headerClasses = [
    styles.header,
    gapClass(actionsGap ?? gap),
    split && (split === 'md' ? styles.splitMd : styles.splitLg),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const texts = (
    <div className={`${styles.texts} ${gapClass(gap)}`}>
      {!actionsTop && eyebrowNode}
      <TitleTag
        className={`${styles.title} ${titleLine === 'normal' ? styles.titleNormal : ''}`}
      >
        {title}
      </TitleTag>
      {lead ? (
        <p className={`${styles.lead} ${leadNarrow ? styles.leadNarrow : ''}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );

  /* Ações: linha própria abaixo (padrão) ou na linha do eyebrow (topo). */
  const actionsNode = actions ? (
    <div className={actionsTop ? styles.top : styles.actions}>{actions}</div>
  ) : null;

  return (
    <header className={headerClasses} {...rest}>
      {actionsTop ? (
        <>
          <div className={styles.top}>
            {eyebrowNode}
            {actions}
          </div>
          {texts}
        </>
      ) : (
        <>
          {texts}
          {actionsNode}
        </>
      )}
    </header>
  );
}
