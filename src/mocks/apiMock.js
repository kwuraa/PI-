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

import hortaViva from '../assets/projects/horta-viva.jpg';
import rotaAcessivel from '../assets/projects/rota-acessivel.jpg';
import aguaEmFoco from '../assets/projects/agua-em-foco.jpg';
import rotaAcessivelHero from '../assets/projects/rota-acessivel-hero.jpg';

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

/** Resposta da tela Explorar (GET /api/projects/explore) */
export const exploreProjectsResponse = {
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
      greeting: 'Olá, Ana. O que vamos descobrir?',
      headline: 'Ideias de todos.\nInspiração para você.',
    },
    search: {
      placeholder: 'Buscar projetos, temas ou autores',
      actionLabel: 'Filtros de busca',
    },
    filters: [
      { id: 'all', label: 'Todos os cursos', active: true },
      { id: 'architecture', label: 'Arquitetura', active: false },
      { id: 'technology', label: 'Tecnologia', active: false },
    ],
    highlight: {
      eyebrow: 'Conhecimento sem fronteiras',
      title: 'Seu próximo projeto pode começar com uma descoberta.',
      meta: '128 projetos · 12 cursos · muitas conexões',
    },
    sections: [
      {
        id: 'featured',
        title: 'Em destaque',
        action: { label: 'Ver todos', href: '/explorar' },
        projects: [
          {
            id: 'prj-001',
            image: hortaViva,
            imageAlt:
              'Horta com canteiros elevados em espaço comunitário do campus',
            category: 'Arquitetura e Urbanismo',
            title: 'Horta Viva: cultivo e comunidade',
            authors: 'Luiza Santos e mais 2 autores · 2026',
            type: 'Projeto integrador',
            saves: 32,
            href: '/projetos/horta-viva',
          },
        ],
      },
      {
        id: 'recent',
        title: 'Novas descobertas',
        action: { label: 'Mais recentes ↓', href: '/explorar' },
        projects: [
          {
            id: 'prj-002',
            image: rotaAcessivel,
            imageAlt:
              'Pessoa usando celular em uma calçada acessível do campus',
            category: 'Sistemas de Informação',
            title: 'Rota Acessível: um campus para todos',
            authors: 'Ana Costa e Lucas Silva · 2026',
            type: 'Projeto integrador',
            saves: 24,
            href: '/projetos/rota-acessivel',
          },
          {
            id: 'prj-003',
            image: aguaEmFoco,
            imageAlt:
              'Placa eletrônica e sensores medindo água em laboratório',
            category: 'Engenharia Ambiental',
            title: 'Água em Foco: qualidade e território',
            authors: 'Camila Rocha e João Freitas · 2026',
            type: 'Projeto integrador',
            saves: 18,
            href: '/projetos/agua-em-foco',
          },
        ],
      },
    ],
  },
};

/**
 * Resposta da tela Detalhes do projeto (GET /api/projects/:slug).
 *
 * O mock devolve o MESMO projeto para qualquer slug cadastrado no feed
 * de exploração — a API real distinguirá cada slug pelo parâmetro de rota.
 */
export const projectDetailsResponse = {
  status: 200,
  data: {
    header: {
      title: 'Projeto',
      menuLabel: 'Mais opções',
    },
    project: {
      id: 'prj-002',
      slug: 'rota-acessivel',
      cover: {
        url: rotaAcessivelHero,
        alt: 'Estudante usando o celular para consultar o mapa acessível do campus',
      },
      category: 'Sistemas de Informação',
      status: { id: 'published', label: 'Publicado' },
      title: 'Rota Acessível: um campus para todos',
      meta: ['Projeto integrador · 2026.2', 'Publicado em 02 out. 2026 · 24 salvos'],
      saved: true,
      saveLabel: 'Projeto salvo',
      description:
        'Uma plataforma para mapear rotas acessíveis no campus, conectando estudantes a trajetos com rampas, piso tátil e elevadores. O projeto combina pesquisa com a comunidade acadêmica e um protótipo navegável para tornar a faculdade mais inclusiva.',
      tags: ['Acessibilidade', 'Tecnologia', 'Inclusão'],
      authors: [
        {
          id: 'usr-001',
          initials: 'AC',
          name: 'Ana Costa',
          role: 'Autora · Sistemas de Informação',
          tone: 'neutral',
        },
        {
          id: 'usr-004',
          initials: 'LS',
          name: 'Lucas Silva',
          role: 'Autor · Sistemas de Informação',
          tone: 'neutral',
        },
        {
          id: 'usr-010',
          initials: 'RM',
          name: 'Prof. Rafael Martins',
          role: 'Orientador',
          tone: 'primary',
        },
      ],
      files: [
        { id: 'file-001', name: 'Relatório_Rota_Acessível.pdf', kind: 'PDF', size: '2,4 MB' },
        { id: 'file-002', name: 'Protótipo_Rota_Acessível.zip', kind: 'ZIP', size: '8,1 MB' },
      ],
      comments: [
        {
          id: 'cmt-001',
          author: 'Marina Oliveira',
          timeLabel: 'Há 2 dias',
          text: 'Ótima iniciativa! O mapa também contempla o acesso à biblioteca?',
        },
        {
          id: 'cmt-002',
          author: 'Ana Costa',
          timeLabel: 'Há 1 dia · Autora',
          text: 'Sim, Marina! Incluímos a biblioteca e os laboratórios no mapeamento.',
        },
      ],
      commentForm: {
        label: 'Participe da conversa',
        placeholder: 'Escreva um comentário...',
        submitLabel: 'Enviar comentário',
      },
    },
  },
};

/** Resposta da tela Perfil e configurações (GET /api/profile) */
export const profileResponse = {
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
      title: 'Meu perfil',
      subtitle: 'Seu espaço, suas informações e suas preferências no PI².',
    },
    card: {
      initials: 'AC',
      name: 'Ana Costa',
      badge: 'Aluna',
      meta: 'Sistemas de Informação · 4º período · Matrícula 202610248',
    },
    form: {
      title: 'Dados institucionais',
      fields: [
        { id: 'name', label: 'Nome completo', value: 'Ana Costa', locked: false },
        {
          id: 'email',
          label: 'E-mail institucional',
          value: 'ana.costa@aluno.faculdade.edu.br',
          locked: true,
          help: 'Vinculado à sua instituição. Para alterar, procure o suporte acadêmico.',
        },
        { id: 'course', label: 'Curso', value: 'Sistemas de Informação', locked: true },
      ],
      submitLabel: 'Salvar alterações',
      savedFeedback: 'Alterações salvas.',
    },
    notifications: {
      title: 'Notificações',
      options: [
        {
          id: 'project-updates',
          label: 'Atualizações dos meus projetos',
          description: 'Pareceres, ajustes e aprovações do orientador.',
          enabled: true,
        },
        {
          id: 'repository-news',
          label: 'Novidades do repositório',
          description: 'Novos projetos e descobertas da comunidade.',
          enabled: false,
        },
      ],
    },
    account: {
      title: 'Conta e privacidade',
      links: [
        { id: 'password', label: 'Alterar senha', icon: 'key', href: '/perfil/alterar-senha' },
        { id: 'privacy', label: 'Privacidade e termos de uso', icon: 'shield', href: '/perfil/privacidade' },
        { id: 'support', label: 'Ajuda e suporte', icon: 'help', href: '/perfil/ajuda' },
      ],
      logoutLabel: 'Sair da conta',
    },
    footer: 'PI² · Ideias que multiplicam conhecimento',
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
  'GET /api/projects/explore': exploreProjectsResponse,
  // Detalhe: mesmo payload para os slugs do feed (mock único — a API real
  // diferenciará cada projeto pelo :slug da rota)
  'GET /api/projects/horta-viva': projectDetailsResponse,
  'GET /api/projects/rota-acessivel': projectDetailsResponse,
  'GET /api/projects/agua-em-foco': projectDetailsResponse,
  'GET /api/profile': profileResponse,
};
