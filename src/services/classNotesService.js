import { request } from './api';

/**
 * Serviço de notas da sala (professor e coordenador).
 */
export const classNotesService = {
  /** GET /api/professor/class-notes */
  async getForProfessor() {
    const response = await request('GET', '/api/professor/class-notes');
    return response.data;
  },

  /** GET /api/coordinator/class-notes */
  async getForCoordinator() {
    const response = await request('GET', '/api/coordinator/class-notes');
    return response.data;
  },
};
