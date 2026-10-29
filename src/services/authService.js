import { request } from './api';

/**
 * Serviço de autenticação.
 * Cada função corresponde a um endpoint REST real.
 */
export const authService = {
  /** POST /api/auth/login */
  async login({ email, password }) {
    const response = await request('POST', '/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};
