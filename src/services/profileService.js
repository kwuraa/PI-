import { request } from './api';

/**
 * Serviço do perfil do usuário logado.
 */
export const profileService = {
  /** GET /api/profile */
  async get() {
    const response = await request('GET', '/api/profile');
    return response.data;
  },
};
