import { request } from './api';

/**
 * Serviço de entregas dos alunos (área do professor).
 */
export const submissionsService = {
  /** GET /api/professor/submissions — lista de trabalhos enviados */
  async getSubmissions() {
    const response = await request('GET', '/api/professor/submissions');
    return response.data;
  },

  /** GET /api/professor/submissions/:slug — detalhe de uma entrega */
  async getDelivery(slug) {
    const response = await request('GET', `/api/professor/submissions/${slug}`);
    return response.data;
  },
};
