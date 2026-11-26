import styles from './ProjectReportSheet.module.css';

/**
 * Aviso provisório da folha impressa.
 * O template institucional com o timbre da FATEC ainda será fornecido; até lá,
 * a impressão não replica os cards nem apresenta um relatório formatado.
 */
export default function ProjectReportSheet() {
  return (
    <section
      className={styles.sheet}
      data-print-only
      aria-label="Aviso sobre a formatação do relatório"
    >
      <h1 className={styles.title}>Aviso</h1>
      <p className={styles.notice}>
        A formatação institucional deste relatório será implementada mais tarde,
        quando o template oficial com a identidade da instituição e o timbre da
        FATEC for fornecido. Por enquanto, a impressão apresenta apenas este
        aviso.
      </p>
    </section>
  );
}
