/** Título único das duas faces do relatório (badge + lead variam por face). */
export const REPORT_TITLE = 'Relatório consolidado';

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
