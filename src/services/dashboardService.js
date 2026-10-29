import { request } from './api';

/**
 * Serviço do painel (dados agregados do usuário logado).
 * O perfil (role) determina qual painel o back-end devolve:
 * 'professor' | 'coordinator' | 'both'.
 */
export const dashboardService = {
  /** GET /api/dashboard?role=... */
  async get(role = 'professor') {
    const response = await request('GET', `/api/dashboard?role=${role}`);
    return response.data;
  },
};
