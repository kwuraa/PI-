import { request } from './api';

/**
 * Serviço de projetos individuais (detalhe).
 */
export const projectService = {
  /** GET /api/projects/:slug */
  async getDetails(slug) {
    const response = await request('GET', `/api/projects/${slug}`);
    return response.data;
  },
};
