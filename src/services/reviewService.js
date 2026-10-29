import { request } from './api';

/**
 * Serviço de revisão de projetos (área do professor).
 */
export const reviewService = {
  /** GET /api/professor/reviews/:slug */
  async get(slug) {
    const response = await request('GET', `/api/professor/reviews/${slug}`);
    return response.data;
  },
};
