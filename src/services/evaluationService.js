import { request } from './api';

/**
 * Serviço de avaliações da coordenação (docente e paritária).
 */
export const evaluationService = {
  /** GET /api/coordinator/teacher-evaluation — desempenho docente */
  async getTeacherPerformance() {
    const response = await request('GET', '/api/coordinator/teacher-evaluation');
    return response.data;
  },

  /** GET /api/coordinator/peer-reviews — avaliação paritária entre coordenadores */
  async getPeerReviews() {
    const response = await request('GET', '/api/coordinator/peer-reviews');
    return response.data;
  },
};
