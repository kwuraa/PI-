import { request } from './api';

/**
 * Serviço de relatórios analíticos.
 */
export const reportService = {
  /** GET /api/professor/class-report — relatório por turma */
  async getClassReport() {
    const response = await request('GET', '/api/professor/class-report');
    return response.data;
  },

  /** GET /api/coordinator/report — relatório consolidado do curso */
  async getConsolidated() {
    const response = await request('GET', '/api/coordinator/report');
    return response.data;
  },
};
