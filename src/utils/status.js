/** Status canônicos do domínio (mock: 'rascunho' | 'em-analise' | 'publicado' | 'ajustes'). */
export const STATUS_VALUES = ['rascunho', 'em-analise', 'publicado', 'ajustes'];

/** Rótulo exibido em badges, filtros e cartões. */
export const STATUS_LABELS = {
  rascunho: 'Rascunho',
  'em-analise': 'Em análise',
  publicado: 'Publicado',
  ajustes: 'Ajustes solicitados',
};

/** Tom do <Badge/> para cada status. */
export const STATUS_TONES = {
  rascunho: 'neutral',
  'em-analise': 'warning',
  publicado: 'success',
  ajustes: 'primary',
};

/**
 * Mapeia um status para { label, tone }.
 * Status desconhecido cai no padrão "Rascunho" (neutral) — mesma regra
 * adotada em toda a aplicação.
 */
export function statusMeta(status) {
  return {
    label: STATUS_LABELS[status] ?? STATUS_LABELS.rascunho,
    tone: STATUS_TONES[status] ?? STATUS_TONES.rascunho,
  };
}

/**
 * Gera as opções `{ value, label }` de um filtro/seletor de status.
 * `labels` permite sobrescrever pontualmente o rótulo (ex.: o filtro de
 * "Meus projetos" usa o plural "Publicados").
 *
 *   statusOptions(['em-analise', 'publicado'])
 *   → [{ value: 'em-analise', label: 'Em análise' }, …]
 */
export function statusOptions(values, labels = STATUS_LABELS) {
  return values.map((value) => ({
    value,
    label: labels[value] ?? STATUS_LABELS[value] ?? value,
  }));
}
