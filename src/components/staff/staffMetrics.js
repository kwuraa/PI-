/**
 * PI² — Métricas derivadas dos mocks para as faces do painel (/painel).
 * -----------------------------------------------------------------------------
 * Fonte única de verdade: os números vêm de REVIEW_QUEUE_IDS, ADVISED_GROUP_IDS
 * e GROUPS (fila de revisão, grupos orientados e entregáveis) — nada fixo.
 * Extraído de StaffPanelPage.jsx na separação "um componente por arquivo"
 * (item 6), porque as TRÊS faces (Professor, Coordinator e Unified) leem
 * os mesmos números.
 */
import {
  ADVISED_GROUP_IDS,
  GROUPS,
  REVIEW_QUEUE_IDS,
} from '../../mocks/projectsMock.js';

/** Métricas derivadas dos mocks (fonte única de verdade). */
export const METRICS = {
  reviewQueue: REVIEW_QUEUE_IDS.length,
  advised: ADVISED_GROUP_IDS.length,
  activeGroups: GROUPS.length,
  pendingDeliveries: GROUPS.reduce((sum, g) => sum + g.pendingDeliveries, 0),
  pendingGroup: GROUPS.find((g) => g.pendingLabel && !g.docsUrl) ?? null,
};
