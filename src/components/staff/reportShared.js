/** Título único das duas faces do relatório (badge + lead variam por face). */
export const REPORT_TITLE = 'Relatório consolidado';

/**
 * Caminho do timbre institucional da FATEC usado no cabeçalho dos relatórios
 * impressos. Enquanto for `null`, <ReportLetterhead/> mostra um aviso com as
 * instruções de instalação. Passos em `docs/07-impressao-abnt.md`.
 */
export const REPORT_LETTERHEAD_SRC = null;

/** Unidade da FATEC exibida no cabeçalho quando ainda não há imagem do timbre. */
export const REPORT_UNIT_NAME = '[Nome da Unidade]';

/** Nome do curso por extenso, no cabeçalho da ficha. */
export const REPORT_COURSE_NAME = 'Desenvolvimento de Software';

/**
 * Exporta/imprime o relatório abrindo o diálogo NATIVO de impressão do
 * navegador (o usuário pode escolher "Salvar como PDF" na impressora).
 * SIMULAÇÃO: NÃO há geração real de arquivo PDF neste projeto — nada é
 * calculado nem enviado ao servidor; o PDF sai do motor de impressão do
 * próprio navegador, a partir do CSS da página. Vale para os botões
 * "Exportar relatório em PDF" (face 06), "Exportar PDF" e "Imprimir"
 * (face 08).
 */
export function handlePrint() {
  window.print();
}
