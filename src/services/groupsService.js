import { request } from './api';

/**
 * Serviço de gestão de grupos (coordenador).
 */
export const groupsService = {
  /** GET /api/coordinator/groups */
  async getGroups() {
    const response = await request('GET', '/api/coordinator/groups');
    return response.data;
  },
};
