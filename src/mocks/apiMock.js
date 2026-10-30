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
import aquasenseHero from '../assets/projects/aquasense-hero.jpg';

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

/** ============================================================
 * Painel (GET /api/dashboard?role=professor|coordinator|both)
 * O mock devolve um payload diferente por perfil — a API real
 * decidirá pelo usuário da sessão, sem a página mudar.
 * ============================================================ */

/** Perfil: professor — painel com pendências acadêmicas */
export const professorDashboardResponse = {
  status: 200,
  data: {
    user: {
      id: 'usr-010',
      name: 'Prof. Rafael Martins',
      initials: 'RM',
      role: 'professor',
    },
    header: {
      context: 'Espaço do professor',
      badge: 'Área do professor',
      greeting: 'Olá, prof. Rafael.',
      headline: 'Vamos orientar ideias?',
      description:
        'Seu olhar transforma projetos em conhecimento compartilhado.',
    },
    stats: [
      {
        id: 'awaiting-review',
        icon: 'review',
        value: 2,
        label: 'Aguardando revisão',
        variant: 'primary', // destaque vermelho
      },
      {
        id: 'advising',
        icon: 'advising',
        value: 3,
        label: 'Projetos sob orientação',
        variant: 'default',
      },
    ],
    pendingCard: {
      value: 1,
      title: 'Sala com notas pendentes',
      meta: 'ADS · Sala A · Projeto Integrador II',
      action: { label: 'Lançar notas', href: '/professor/notas' },
    },
    sections: [
      {
        id: 'defenses',
        title: 'Próximas bancas',
        action: { label: '2 agendadas' },
        cards: [
          {
            id: 'def-001',
            type: 'info',
            badge: { label: 'Parcial', tone: 'amber' },
            title: 'AquaSense: monitoramento da água',
            meta: '09 out. 2026 · 19h30 · Sala 204',
          },
          {
            id: 'def-002',
            type: 'info',
            badge: { label: 'Final', tone: 'primary' },
            title: 'Rota Acessível: um campus para todos',
            meta: '16 out. 2026 · 20h30 · Sala 102',
          },
        ],
      },
      {
        id: 'reviews',
        title: 'Aguardando revisão',
        action: { label: '2 projetos' },
        cards: [
          {
            id: 'rev-001',
            type: 'review',
            status: 'Em análise',
            title: 'AquaSense: monitoramento da água',
            course: 'Engenharia Ambiental',
            authors: 'Beatriz Lima e Pedro Alves',
            submittedAt: 'Enviado em 03 out. · Há 3 dias',
            action: { label: 'Revisar projeto', href: '/professor/revisar/aquasense' },
          },
          {
            id: 'rev-002',
            type: 'review',
            status: 'Em análise',
            title: 'Biblioteca Conectada: acervo digital',
            course: 'Sistemas de Informação',
            authors: 'Ana Costa e Lucas Silva',
            submittedAt: 'Enviado em 05 out. · Há 1 dia',
            action: { label: 'Revisar projeto', href: '/professor/revisar/biblioteca-conectada' },
          },
        ],
      },
      {
        id: 'advising',
        title: 'Minhas orientações',
        action: { label: 'Ver todas (3)' },
        cards: [
          {
            id: 'adv-001',
            type: 'info',
            badge: { label: 'Publicado', tone: 'success' },
            title: 'Rota Acessível: um campus para todos',
            meta: 'Ana Costa e Lucas Silva · Aprovado em 02 out.',
          },
        ],
      },
    ],
    areas: {
      title: 'Áreas acadêmicas',
      description: 'Acompanhe a avaliação e o desempenho das suas turmas.',
      links: [
        { id: 'my-criteria', label: 'Meus critérios', href: '/professor/criterios' },
        { id: 'class-report', label: 'Relatório por turma', href: '/professor/relatorio' },
      ],
    },
    alert: null,
  },
};

/** Perfil: coordenador — painel da coordenação */
export const coordinatorDashboardResponse = {
  status: 200,
  data: {
    user: {
      id: 'usr-020',
      name: 'Marta Campos',
      initials: 'MC',
      role: 'coordinator',
    },
    header: {
      context: 'Espaço do coordenador',
      badge: 'Área do coordenador',
      greeting: 'Olá, coordenador(a).',
      headline: 'Vamos acompanhar o PI?',
      description:
        'Acompanhe os grupos, as entregas e a avaliação do semestre.',
    },
    stats: [
      {
        id: 'active-groups',
        icon: 'advising',
        value: 4,
        label: 'Grupos ativos',
        variant: 'primary',
      },
      {
        id: 'pending-deliverables',
        icon: 'review',
        value: 2,
        label: 'Entregáveis pendentes',
        variant: 'default',
      },
    ],
    pendingCard: {
      value: 3,
      title: 'Avaliações paritárias pendentes',
      meta: 'Total agregado dos ciclos em aberto',
      action: { label: 'Acompanhar avaliações', href: '/coordenador/paritarias' },
    },
    sections: [],
    areas: {
      title: 'Áreas da coordenação',
      description: 'Organize os critérios e acompanhe o desempenho do curso.',
      links: [
        { id: 'course-criteria', label: 'Critérios do curso', href: '/coordenador/criterios' },
        { id: 'faculty-performance', label: 'Desempenho docente', href: '/coordenador/desempenho' },
        { id: 'peer-review', label: 'Avaliação paritária', href: '/coordenador/paritarias' },
        { id: 'consolidated-report', label: 'Relatório consolidado', href: '/coordenador/relatorio' },
        { id: 'groups', label: 'Gestão de grupos', href: '/coordenador/grupos' },
      ],
    },
    alert: {
      icon: 'warning',
      title: 'Grupo sem link de documentação',
      description: 'EcoCampus · ADS · 2º semestre',
      action: { label: 'Resolver', href: '/coordenador/grupos', arrow: false },
    },
  },
};

/** Perfil: professor E coordenador — painel unificado com abas */
export const unifiedDashboardResponse = {
  status: 200,
  data: {
    user: {
      id: 'usr-010',
      name: 'Prof. Rafael Martins',
      initials: 'RM',
      role: 'professor_coordinator',
    },
    header: {
      context: 'Coordenador e professor',
      badge: 'Espaço do professor e coordenador',
      greeting: 'Olá, prof. Rafael.',
      headline: 'Você orienta e coordena.',
      description:
        'Suas orientações e a gestão do curso, no mesmo lugar.',
    },
    tabs: [
      { id: 'panel', label: 'Painel unificado' },
      { id: 'shortcuts', label: 'Atalhos' },
    ],
    overview: {
      professor: {
        title: 'Como professor',
        stats: [
          {
            id: 'awaiting-review',
            icon: 'review',
            value: 2,
            label: 'Aguardando revisão',
            variant: 'primary',
          },
          {
            id: 'advising',
            icon: 'advising',
            value: 3,
            label: 'Projetos sob orientação',
            variant: 'default',
          },
        ],
        pendingRow: {
          icon: 'pencil',
          value: 1,
          label: 'Sala com notas pendentes',
          tone: 'amber',
          href: '/professor/notas',
        },
      },
      coordinator: {
        title: 'Como coordenador',
        rows: [
          {
            id: 'active-groups',
            icon: 'users',
            value: 4,
            label: 'Grupos ativos',
            tone: 'neutral',
            href: '/coordenador/grupos',
          },
          {
            id: 'peer-reviews',
            icon: 'message',
            value: 3,
            label: 'Paritárias pendentes',
            tone: 'amber',
            href: '/coordenador/paritarias',
          },
          {
            id: 'deliverables',
            icon: 'file',
            value: 2,
            label: 'Entregáveis pendentes',
            tone: 'amber',
            href: '/coordenador/entregaveis',
          },
        ],
      },
    },
    alert: {
      icon: 'link-off',
      title: 'Grupo sem link de documentação',
      description:
        'Confira o grupo e regularize o link para acompanhar as entregas.',
      action: { label: 'Resolver', href: '/coordenador/grupos' },
    },
    shortcuts: {
      title: 'Atalhos',
      description:
        'Prof. Rafael, suas ações para orientar e coordenar, reunidas aqui.',
      groups: [
        {
          id: 'professor',
          title: 'Professor',
          items: [
            { id: 'grades', icon: 'notes', label: 'Lançar notas', role: 'Professor', href: '/professor/notas' },
            { id: 'my-criteria', icon: 'criteria', label: 'Meus critérios', role: 'Professor', href: '/professor/criterios' },
            { id: 'class-report', icon: 'report', label: 'Relatório por turma', role: 'Professor', href: '/professor/relatorio' },
          ],
        },
        {
          id: 'coordinator',
          title: 'Coordenador',
          items: [
            { id: 'course-criteria', icon: 'course', label: 'Critérios do curso', role: 'Coordenador', href: '/coordenador/criterios' },
            { id: 'evaluate-teachers', icon: 'evaluation', label: 'Avaliar docentes', role: 'Coordenador', href: '/coordenador/avaliar' },
            { id: 'peer-review', icon: 'peer', label: 'Paritária', role: 'Coordenador', href: '/coordenador/paritarias' },
            { id: 'consolidated', icon: 'consolidated', label: 'Relatório consolidado', role: 'Coordenador', href: '/coordenador/relatorio' },
          ],
        },
      ],
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

/** Resposta da tela Projetos salvos (GET /api/saved-projects) */
export const savedProjectsResponse = {
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
      badge: 'Sua coleção',
      title: 'Inspirações para guardar.',
      subtitle:
        'Reencontre os projetos que você salvou e continue suas descobertas.',
    },
    search: {
      placeholder: 'Buscar nos projetos salvos',
    },
    list: {
      title: 'Seus salvos',
      action: { label: 'Mais recentes ↓' },
      projects: [
        {
          id: 'prj-002',
          image: rotaAcessivelHero,
          imageAlt:
            'Pessoa usando o celular para consultar o mapa acessível do campus',
          category: 'Sistemas de Informação',
          title: 'Rota Acessível: um campus para todos',
          authors: 'Ana Costa e Lucas Silva · 2026',
          type: 'Projeto integrador',
          saves: 24,
          href: '/projetos/rota-acessivel',
        },
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
    footerAction: {
      label: 'Explorar mais projetos',
      href: '/explorar',
    },
  },
};

/** Resposta da tela Revisão de projeto (GET /api/professor/reviews/:slug) */
export const projectReviewResponse = {
  status: 200,
  data: {
    header: {
      title: 'Revisar projeto',
      menuLabel: 'Mais opções',
    },
    review: {
      id: 'rev-001',
      slug: 'aquasense',
      status: { label: 'Aguardando seu parecer', tone: 'amber' },
      date: '03 out. 2026',
      cover: {
        url: aquasenseHero,
        alt: 'Protótipo com sensores medindo água em laboratório',
      },
      title: 'AquaSense: monitoramento da água',
      meta: 'Engenharia Ambiental · Projeto integrador · 2026.2',
      authors: 'Beatriz Lima e Pedro Alves',
      advisor: 'Orientador: Prof. Rafael Martins',
      summary:
        'Sistema de baixo custo para monitorar a qualidade da água com sensores de pH e turbidez. Os dados são reunidos em um painel para apoiar ações de educação ambiental e a identificação de alterações em reservatórios da região.',
      files: [
        { id: 'file-001', name: 'Relatório_AquaSense.pdf', kind: 'PDF', size: '3,2 MB', version: 1 },
        { id: 'file-002', name: 'Dados_dos_sensores.xlsx', kind: 'XLSX', size: '840 KB', version: 1 },
      ],
      criteria: {
        title: 'Critérios de revisão',
        items: [
          { id: 'authorship', label: 'Dados e autoria conferidos', checked: true },
          { id: 'files', label: 'Arquivos completos e legíveis', checked: true },
          { id: 'adequate', label: 'Conteúdo adequado ao repositório', checked: true },
        ],
      },
      opinion: {
        label: 'Comentário para a equipe',
        required: true,
        value:
          'O projeto apresenta metodologia clara e resultados bem documentados. Os arquivos estão completos e o conteúdo contribui para as pesquisas em monitoramento ambiental. Recomendo a publicação.',
        helper:
          'Este parecer será enviado aos autores e ficará no histórico do projeto.',
      },
      alert: {
        icon: 'shield',
        title: 'Você decide a próxima etapa',
        description:
          'Ao aprovar, o projeto será publicado para a comunidade acadêmica. Se solicitar ajustes, informe o que precisa ser revisado.',
      },
      approveLabel: 'Aprovar e publicar',
      requestChangesLabel: 'Solicitar ajustes',
      decisionFooter: 'A equipe será notificada sobre sua decisão.',
    },
  },
};

/** Resposta do formulário Novo projeto (GET /api/student/projects/new) */
export const newProjectFormResponse = {
  status: 200,
  data: {
    header: {
      title: 'Novo projeto',
      headline: 'Sua ideia merece ser compartilhada.',
      description:
        'Preencha os dados e envie ao seu orientador. Os campos com * são obrigatórios.',
      draftLabel: 'Rascunho salvo às 09:38',
    },
    about: {
      title: 'Sobre o projeto',
      fields: {
        title: {
          label: 'Título do projeto',
          required: true,
          value: 'EcoCampus: gestão de resíduos',
        },
        course: {
          label: 'Curso',
          required: true,
          value: 'Sistemas de Informação',
          options: [
            'Sistemas de Informação',
            'Engenharia Ambiental',
            'Arquitetura e Urbanismo',
            'Análise e Desenvolvimento de Sistemas',
          ],
        },
        type: {
          label: 'Tipo de projeto',
          required: true,
          value: 'Projeto integrador',
          options: ['Projeto integrador', 'TCC', 'Pesquisa', 'Extensão'],
        },
        description: {
          label: 'Descrição',
          required: true,
          maxLength: 2000,
          value:
            'Plataforma para acompanhar a coleta seletiva e os pontos de descarte no campus, incentivando práticas sustentáveis na comunidade acadêmica.',
        },
      },
    },
    team: {
      title: 'Quem participa',
      members: {
        label: 'Integrantes',
        required: true,
        value: 'Ana Costa; Lucas Silva',
        help: 'Você é a responsável pelo envio deste projeto.',
      },
      addMemberLabel: 'Adicionar integrante por e-mail',
      advisor: {
        label: 'Orientador',
        required: true,
        value: 'Prof. Rafael Martins',
        options: ['Prof. Rafael Martins', 'Profa. Marta Campos', 'Prof. Diego Alencar'],
      },
    },
    files: {
      title: 'Arquivos do projeto',
      upload: {
        title: 'Toque para adicionar arquivos',
        hint: 'PDF, ZIP ou imagens · até 20 MB por arquivo',
      },
      items: [
        {
          id: 'file-001',
          name: 'Relatório_EcoCampus.pdf',
          kind: 'PDF',
          size: '1,8 MB',
          status: 'Upload concluído',
        },
      ],
    },
    visibility: {
      title: 'Quem poderá ver?',
      selected: 'public',
      options: [
        {
          id: 'public',
          label: 'Comunidade acadêmica',
          description: 'Disponível para alunos e professores.',
        },
        {
          id: 'restricted',
          label: 'Somente equipe e orientador',
          description: 'Acesso restrito aos participantes.',
        },
      ],
    },
    alert: {
      icon: 'info',
      title: 'A publicação passa por revisão',
      description:
        'Seu orientador será notificado. O projeto só ficará disponível após a aprovação.',
    },
    submitLabel: 'Enviar para análise',
    draftActionLabel: 'Salvar rascunho',
    sentFeedback: 'Projeto enviado ao orientador. Acompanhe o status em Meus projetos.',
    draftFeedback: 'Rascunho salvo.',
  },
};

/** Resposta de Notas da sala — professor (GET /api/professor/class-notes) */
export const professorClassNotesResponse = {
  status: 200,
  data: {
    user: { id: 'usr-010', name: 'Prof. Rafael Martins', initials: 'RM', role: 'professor' },
    header: {
      context: 'Espaço do professor',
      backLabel: 'Painel do professor',
      backHref: '/painel',
      title: 'Notas da sala',
      description: 'Avalie cada aluno e acompanhe a média da sala.',
    },
    selector: {
      title: 'Selecionar sala',
      semester: { label: 'Semestre', value: '2026.2', options: ['2026.2', '2026.1'] },
      room: { label: 'Sala', value: 'ADS · A', options: ['ADS · A', 'ADS · B'] },
      discipline: { label: 'Disciplina', value: 'Projeto Integrador II', options: ['Projeto Integrador II', 'Projeto Integrador III'] },
      meta: 'Ingresso 2026.1 · 4 alunos matriculados',
    },
    formula: {
      title: 'Como a média é calculada',
      description:
        'Documentação × 0,4 + Apresentação × 0,3 + Código × 0,3. Notas de 0 a 10; aprovação a partir de 6,0.',
    },
    criteria: [
      { id: 'documentation', label: 'Documentação', weight: '40%', factor: 0.4 },
      { id: 'presentation', label: 'Apresentação', weight: '30%', factor: 0.3 },
      { id: 'code', label: 'Código', weight: '30%', factor: 0.3 },
    ],
    section: { title: 'Notas dos alunos' },
    students: [
      { id: 'usr-001', name: 'Ana Costa', ra: 'RA 202610001', scores: { documentation: 8, presentation: 9, code: 8 }, notes: 'Boa documentação e apresentação segura.' },
      { id: 'usr-003', name: 'Beatriz Lima', ra: 'RA 202610002', scores: { documentation: 7, presentation: 8, code: 7 }, notes: 'Detalhar os resultados dos testes.' },
      { id: 'usr-004', name: 'Lucas Silva', ra: 'RA 202610003', scores: { documentation: 6, presentation: 7, code: 6 }, notes: 'Revisar a organização do repositório.' },
      { id: 'usr-005', name: 'Pedro Alves', ra: 'RA 202610004', scores: { documentation: 5, presentation: 4, code: 5 }, notes: 'Reforçar a apresentação e concluir os testes.' },
    ],
    pendingBadge: 'Pendente · alterações não salvas',
    saveLabel: 'Salvar notas',
    footer: 'As médias são atualizadas automaticamente. Confira os valores antes de salvar.',
    savedFeedback: 'Notas salvas.',
  },
};

/** Resposta de Notas da sala — coordenador (GET /api/coordinator/class-notes) */
export const coordinatorClassNotesResponse = {
  status: 200,
  data: {
    user: { id: 'usr-010', name: 'Prof. Rafael Martins', initials: 'RM', role: 'professor_coordinator' },
    header: {
      context: 'Coordenador e professor',
      backLabel: 'Painel unificado',
      backHref: '/painel',
      badge: 'Coordenador',
      title: 'Notas da sala',
      description: 'Consulte e edite as notas de qualquer sala do curso.',
    },
    selector: {
      editNotice: { icon: 'shield', label: 'Edição liberada para qualquer sala' },
      semester: { label: 'Semestre', value: '2026.2', options: ['2026.2', '2026.1'] },
      room: { label: 'Sala', value: '3º ADS · A', options: ['3º ADS · A', '3º ADS · B', '2º ADS · A'] },
      discipline: { label: 'Disciplina', value: 'Projeto Integrador III', options: ['Projeto Integrador III', 'Projeto Integrador II'] },
    },
    section: {
      averageLabel: 'Média da sala',
      note: 'Notas de 0 a 10. Média simples dos três critérios, com pesos iguais.',
    },
    criteria: [
      { id: 'documentation', label: 'Documentação' },
      { id: 'presentation', label: 'Apresentação' },
      { id: 'code', label: 'Código' },
    ],
    students: [
      { id: 'usr-001', name: 'Ana Costa', project: 'Biblioteca Conectada', scores: { documentation: 8, presentation: 9, code: 7 }, notes: 'Melhorar a cobertura dos testes.' },
      { id: 'usr-004', name: 'Lucas Silva', project: 'Biblioteca Conectada', scores: { documentation: 9, presentation: 8, code: 10 }, notes: 'Código organizado e bem documentado.' },
      { id: 'usr-003', name: 'Beatriz Lima', project: 'AquaSense', scores: { documentation: 7, presentation: 6, code: 8 }, notes: 'Aprofundar a apresentação dos resultados.' },
    ],
    pendingBadge: 'Pendente · alterações não salvas',
    saveLabel: 'Salvar notas',
    footer: 'As notas e observações serão salvas na sala selecionada.',
    savedFeedback: 'Notas salvas.',
  },
};

/** Índice de payloads por perfil usado pelo handler do dashboard */
const dashboardByRole = {
  professor: professorDashboardResponse,
  coordinator: coordinatorDashboardResponse,
  both: unifiedDashboardResponse,
};

/**
 * Mapa de endpoints usado pela camada de serviços.
 * Chave = "MÉTODO /caminho" (mesma convenção das APIs REST).
 */
export const apiMock = {
  'POST /api/auth/login': loginResponse,
  // O painel muda conforme o perfil: o mock lê o parâmetro ?role=
  'GET /api/dashboard': ({ query }) =>
    dashboardByRole[query.role] ?? dashboardByRole.professor,
  'GET /api/student/projects': studentProjectsResponse,
  'GET /api/student/projects/new': newProjectFormResponse,
  'GET /api/projects/explore': exploreProjectsResponse,
  // Detalhe: mesmo payload para os slugs do feed (mock único — a API real
  // diferenciará cada projeto pelo :slug da rota)
  'GET /api/projects/horta-viva': projectDetailsResponse,
  'GET /api/projects/rota-acessivel': projectDetailsResponse,
  'GET /api/projects/agua-em-foco': projectDetailsResponse,
  'GET /api/profile': profileResponse,
  'GET /api/saved-projects': savedProjectsResponse,
  // Revisão: mesmo payload para os slugs em análise (mock único — a API
  // real devolverá cada projeto pelo :slug)
  'GET /api/professor/reviews/aquasense': projectReviewResponse,
  'GET /api/professor/reviews/biblioteca-conectada': projectReviewResponse,
  'GET /api/professor/class-notes': professorClassNotesResponse,
  'GET /api/coordinator/class-notes': coordinatorClassNotesResponse,
};
