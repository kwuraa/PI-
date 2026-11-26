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
