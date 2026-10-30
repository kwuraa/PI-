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

  /** GET /api/student/projects/:slug — meu projeto (visão do autor) */
  async getMyProject(slug) {
    const response = await request('GET', `/api/student/projects/${slug}`);
    return response.data;
  },

  /** GET /api/student/projects/submission — confirmação após o envio */
  async getSubmissionConfirmation() {
    const response = await request('GET', '/api/student/projects/submission');
    return response.data;
  },

  /** GET /api/student/projects/:slug/analysis — acompanhamento da análise */
  async getProjectAnalysis(slug) {
    const response = await request(
      'GET',
      `/api/student/projects/${slug}/analysis`
    );
    return response.data;
  },
};
