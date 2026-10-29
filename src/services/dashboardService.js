import { request } from './api';

/**
 * Serviço do painel (dados agregados do usuário logado).
 */
export const dashboardService = {
  /** GET /api/dashboard */
  async get() {
    const response = await request('GET', '/api/dashboard');
    return response.data;
  },
};
