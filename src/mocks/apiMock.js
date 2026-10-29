/**
 * ============================================================
 * PI² — Dados simulados (MOCKS)
 * ============================================================
 *
 * Este arquivo simula as respostas da API REST que será
 * implementada no próximo semestre. Os objetos estão escritos
 * EXATAMENTE no formato que o back-end devolverá:
 *
 *   { "status": <código HTTP>, "data": <carga útil> }
 *
 * Quando a API real entrar em produção, basta trocar a origem
 * dos dados em `src/services/api.js` — nenhuma página muda.
 *
 * Estratégia: um "endpoint" por exportação nomeada, agrupado
 * por recurso (auth, projects, dashboard...).
 * ============================================================
 */

/** Resposta de autenticação (POST /api/auth/login) */
export const loginResponse = {
  status: 200,
  data: {
    token: 'mock-jwt-token-abc123',
    user: {
      id: 'usr-001',
      name: 'Ana Costa',
      initials: 'AC',
      email: 'ana.costa@aluno.faculdade.edu.br',
      role: 'student', // 'student' | 'professor' | 'coordinator'
      course: 'Arquitetura e Urbanismo',
    },
  },
};

/** Resposta do painel unificado (GET /api/dashboard) */export const dashboardResponse = {
  status: 200,
  data: {
    user: {
      id: 'usr-002',
      name: 'Rafael Moura',
      initials: 'RM',
      role: 'professor_coordinator',
    },
    header: {
      context: 'Coordenador e professor',
      greeting: 'Olá, prof. Rafael.',
      headline: 'Você orienta e coordena.',
      description: 'Suas orientações e a gestão do curso, no mesmo lugar.',
      badge: 'Espaço do professor e coordenador',
    },
    sections: [
      {
        id: 'as-professor',
        title: 'Como professor',
        stats: [
          {
            id: 'awaiting-review',
            icon: 'review',
            value: 2,
            label: 'Aguardando revisão',
            variant: 'primary', // destaque vermelho
            href: '/professor/revisoes',
          },
          {
            id: 'advising',
            icon: 'advising',
            value: 3,
            label: 'Projetos sob orientação',
            variant: 'default',
            href: '/professor/orientacoes',
          },
        ],
        rows: [
          {
            id: 'pending-grades',
            icon: 'pencil',
            value: 1,
            label: 'Sala com notas pendentes',
            href: '/professor/notas',
          },
        ],
      },
      {
        id: 'as-coordinator',
        title: 'Como coordenador',
        stats: [],
        rows: [
          {
            id: 'active-groups',
            icon: 'users',
            value: 4,
            label: 'Grupos ativos',
            href: '/coordenador/grupos',
          },
          {
            id: 'pending-peer-reviews',
            icon: 'message',
            value: 3,
            label: 'Paritárias pendentes',
            href: '/coordenador/paritarias',
          },
          {
            id: 'pending-deliverables',
            icon: 'file',
            value: 2,
            label: 'Entregáveis pendentes',
            href: '/coordenador/entregaveis',
          },
        ],
      },
    ],
    alert: {
      id: 'missing-doc-link',
      icon: 'link-off',
      title: 'Grupo sem link de documentação',
      description:
        'Confira o grupo e regularize o link para acompanhar as entregas.',
      action: {
        label: 'Resolver',
        href: '/coordenador/grupos',
      },
    },
  },
};

/** Resposta dos projetos do aluno (GET /api/student/projects) */
export const studentProjectsResponse = {
  status: 200,
  data: {
    user: {
      id: 'usr-001',
      name: 'Ana Costa',
      initials: 'AC',
      role: 'student',
    },
    header: {
      context: 'Conhecimento conectado',
      badge: 'Área do aluno',
      headline: 'Minhas ideias em ação.',
      description:
        'Acompanhe cada etapa dos projetos que você está construindo.',
      action: { label: 'Novo projeto', href: '/meus-projetos/novo' },
    },
    stats: [
      { id: 'published', value: 1, label: 'Publicado' },
      { id: 'in-review', value: 1, label: 'Em análise' },
      { id: 'draft', value: 1, label: 'Rascunho' },
    ],
    section: {
      title: 'Seus projetos',
      actionLabel: 'Todos (3)',
      projects: [
        {
          id: 'prj-001',
          status: 'published',
          title: 'Rota Acessível: um campus para todos',
          course: 'Sistemas de Informação',
          period: '2026.2',
          meta: {
            icon: 'check',
            text: 'Aprovado em 02 out. · 24 salvos',
          },
          action: { label: 'Ver projeto', href: '/projetos/rota-acessivel' },
        },
        {
          id: 'prj-002',
          status: 'in-review',
          title: 'Biblioteca Conectada: acervo digital',
          course: 'Sistemas de Informação',
          period: '2026.2',
          meta: {
            icon: 'clock',
            text: 'Enviado em 05 out. · Aguardando orientador',
          },
          action: {
            label: 'Acompanhar análise',
            href: '/projetos/biblioteca-conectada',
          },
        },
        {
          id: 'prj-003',
          status: 'draft',
          title: 'EcoCampus: gestão de resíduos',
          course: 'Sistemas de Informação',
          period: '2026.2',
          meta: {
            icon: 'pencil',
            text: 'Última edição hoje, às 09:38',
          },
          action: { label: 'Continuar edição', href: '/projetos/ecocampus' },
        },
      ],
    },
  },
};

/**
 * Mapa de endpoints usado pela camada de serviços.
 * Chave = "MÉTODO /caminho" (mesma convenção das APIs REST).
 */
export const apiMock = {
  'POST /api/auth/login': loginResponse,
  'GET /api/dashboard': dashboardResponse,
  'GET /api/student/projects': studentProjectsResponse,
};
