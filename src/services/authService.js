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

  /** POST /api/auth/register — cadastro institucional */
  async register(payload) {
    const response = await request('POST', '/api/auth/register', payload);
    return response.data;
  },

  /** POST /api/auth/recover — recuperação de senha */
  async recover({ email }) {
    const response = await request('POST', '/api/auth/recover', { email });
    return response.data;
  },
};
