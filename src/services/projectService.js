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

  /** GET /api/projects/:slug/public — leitura pública (somente visualização) */
  async getPublic(slug) {
    const response = await request('GET', `/api/projects/${slug}/public`);
    return response.data;
  },
};
