import { request } from './api';

/**
 * Serviço de projetos salvos (coleção do usuário).
 */
export const savedProjectsService = {
  /** GET /api/saved-projects */
  async get() {
    const response = await request('GET', '/api/saved-projects');
    return response.data;
  },
};
