import {
  REPORT_COURSE_NAME,
  REPORT_LETTERHEAD_SRC,
  REPORT_UNIT_NAME,
} from './reportShared.js';
import styles from './ReportLetterhead.module.css';

/**
 * Cabeçalho institucional exibido na tela.
 * Temporariamente fora da folha impressa: a impressão mostra apenas o aviso de
 * que o template com o timbre será implementado mais tarde. Quando o template
 * oficial chegar, basta remover `data-print-hide` da raiz e ajustar o conteúdo
 * de `ProjectReportSheet`. Instruções em docs/07-impressao-abnt.md.
 */
export default function ReportLetterhead({
  unitName = REPORT_UNIT_NAME,
  courseName = REPORT_COURSE_NAME,
  semesterLabel = null,
}) {
  return (
    <div className={styles.letterhead} data-print-hide>
      {REPORT_LETTERHEAD_SRC ? (
        <img
          className={styles.image}
          src={REPORT_LETTERHEAD_SRC}
          alt="Timbre da FATEC"
        />
      ) : (
        <p className={styles.institution}>
          CENTRO PAULA SOUZA – FATEC {unitName}
        </p>
      )}
      <p className={styles.course}>
        Curso Superior de Tecnologia em {courseName}
      </p>
      {semesterLabel && (
        <p className={styles.semester}>Semestre/Ano: {semesterLabel}</p>
      )}
      {!REPORT_LETTERHEAD_SRC && (
        <p className={styles.hint} data-print-hide>
          Timbre pendente — adicione o arquivo conforme
          docs/07-impressao-abnt.md
        </p>
      )}
    </div>
  );
}
