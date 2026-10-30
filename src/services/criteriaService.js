import { request } from './api';

/**
 * Serviço de critérios de avaliação.
 */
export const criteriaService = {
  /** GET /api/professor/criteria — critérios gerais + específicos da disciplina */
  async getForProfessor() {
    const response = await request('GET', '/api/professor/criteria');
    return response.data;
  },

  /** GET /api/coordinator/criteria — critérios gerais do curso */
  async getForCourse() {
    const response = await request('GET', '/api/coordinator/criteria');
    return response.data;
  },
};
