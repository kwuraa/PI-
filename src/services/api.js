import { apiMock } from '../mocks/apiMock';

/**
 * ============================================================
 * PI² — Camada de serviços (única porta de entrada de dados)
 * ============================================================
 *
 * As páginas NUNCA importam os mocks diretamente. Elas chamam
 * funções como `authService.login(...)` ou `dashboardService.get()`,
 * que por sua vez passam por este módulo.
 *
 * Assim, quando a API real chegar, mudamos APENAS este arquivo
 * (ou a variável VITE_API_URL) e nenhuma página é refatorada.
 *
 * Fluxo futuro:
 *   página → serviço → fetch(VITE_API_URL + path) → back-end
 * ============================================================
 */

// Em produção com back-end, defina VITE_API_URL no .env.
const API_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'; // default: true

/** Simula o latência de uma resposta real (evita "piscar" no mock). */
const MOCK_DELAY_MS = 350;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Realiza uma requisição no formato REST.
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {string} path - caminho do endpoint, ex.: '/api/auth/login'
 * @param {object} [body] - carga útil (enviada em POST/PUT/PATCH)
 * @returns {Promise<{status: number, data: any}>}
 */
export async function request(method, path, body = undefined) {
  if (USE_MOCKS) {
    const key = `${method} ${path}`;
    const response = apiMock[key];

    await wait(MOCK_DELAY_MS);

    if (!response) {
      throw new ApiError(`Endpoint não encontrado no mock: ${key}`, 404);
    }

    return response;
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, options);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      json?.message ?? 'Erro na requisição',
      res.status,
    );
  }

  return json;
}

/** Erro padronizado para falhas de requisição. */
export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
