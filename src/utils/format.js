/**
 * PI² — Funções utilitárias (formatação PT-BR).
 * Centraliza regras de exibição como números, datas e contagens para que
 * nenhuma página precise repetir toLocaleString / replace por aí.
 */

/** Formata um número no padrão brasileiro (1.284 · 32). */
export function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/** Formata um percentual com vírgula decimal (87,5%). */
export function formatPercent(value, digits = 1) {
  return `${value.toFixed(digits).replace('.', ',')}%`;
}

/** Converte "2026-10-02" (ou Date) em "02 out. 2026". */
export function formatDate(iso) {
  const date = typeof iso === 'string' ? new Date(`${iso}T12:00:00`) : iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace('.', '');
}

/** Trunca texto com reticências para cards compactos. */
export function truncate(text, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
