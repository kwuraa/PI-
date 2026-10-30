import { request } from './api';

/**
 * Serviço da área do aluno.
 */
export const studentService = {
  /** GET /api/student/projects */
  async getMyProjects() {
    const response = await request('GET', '/api/student/projects');
    return response.data;
  },

  /** GET /api/student/projects/new — formulário de publicação */
  async getNewProjectForm() {
    const response = await request('GET', '/api/student/projects/new');
    return response.data;
  },
};
