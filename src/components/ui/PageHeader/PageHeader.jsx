/**
 * PI² — Cabeçalho padrão de página (eyebrow + título + texto de apoio).
 * -----------------------------------------------------------------------------
 * Substitui os ~11 blocos `<header>` duplicados nas telas (GroupsPage,
 * DeliveriesPage, HelpPage, ChangePasswordPage, ProfilePage, CoursesPage,
 * EvolutionPage, StaffPanelPage ×3, RelatorioConsolidadoPage, ExplorePage,
 * ProfessorProjectPage), que divergiam só em gap, line-height do título e
 * no tipo de "pill" acima do h1.
 *
 * Props:
 *  • eyebrow      → string (renderiza a pill) ou nó pronto (ex.: <Badge/>);
 *  • caps         → pill em CAIXA ALTA com letter-spacing (ajuda/segurança);
 *  • title        → texto ou nó do h1 (aceita conteúdo condicional);
 *  • lead         → texto de apoio sob o título;
 *  • actions      → botões/ações;
 *  • actionsTop   → true: eyebrow + actions numa linha ACIMA do título
 *                   (padrão do "Meu projeto e materiais");
 *  • gap          → espaço entre eyebrow/título/lead: 'sm'|'md'|'lg';
 *  • actionsGap   → espaço entre textos e ações (padrão: `gap`);
 *  • titleLine    → 'tight' (padrão) | 'normal' (line-height do h1);
 *  • leadNarrow   → limita o lead a 60ch (medida de leitura);
 *  • split        → 'md'|'lg': vira linha (textos à esquerda, ações à
 *                   direita) a partir do breakpoint;
 *  • titleAs      → tag do título (padrão 'h1');
 *  • className    → classe extra no <header> (a página pode usar
 *                   descendentes, ex.: `.page h1 { font-size: 3xl }`).
 *
 * Uso:
 *   <PageHeader eyebrow="Ajuda e suporte" caps title="Como podemos ajudar?"
 *               lead="Respostas rápidas…" gap="sm" titleLine="normal" />
 */
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
    <header className={headerClasses}>
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
