import { request } from './api';

/**
 * Serviço de exploração de projetos (feed público/logado).
 */
export const exploreService = {
  /** GET /api/projects/explore */
  async getFeed() {
    const response = await request('GET', '/api/projects/explore');
    return response.data;
  },
};
