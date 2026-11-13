/**
 * PI² — MOCK DATA principal (projetos, grupos, evolução e revisões).
 * -----------------------------------------------------------------------------
 * TODOS os dados deste arquivo são exclusivamente do curso
 * DSM · Desenvolvimento de Software — nenhum outro curso aparece no sistema.
 *
 * Para alterar uma tela, edite os objetos abaixo (títulos, status, datas,
 * integrantes…) sem tocar no código React. Estrutura pensada como uma futura
 * resposta de API REST (arrays de entidades com ids estáveis).
 */

/** Curso canônico exibido em toda a aplicação. */
export const COURSE = 'DSM · Desenvolvimento de Software';
export const COURSE_SHORT = 'DSM';

/** Tecnologias do currículo DSM (usadas nos cards e nos filtros). */
export const TECHNOLOGIES = [
  'React.js',
  'Node.js',
  'TypeScript',
  'Python',
  'Tailwind CSS',
  'Supabase',
  'Docker',
  'HTML5/CSS3',
];

/** Semestres do curso (filtro 1º ao 6º). */
export const SEMESTERS = [1, 2, 3, 4, 5, 6];

/**
 * Exemplos de Projeto Integrador por semestre do DSM
 * (1º site estático → 5º/6º SaaS multi-tenant / cloud).
 */
export const PI_EXAMPLES = {
  1: 'Site institucional responsivo (HTML5/CSS3)',
  2: 'Aplicação web com DOM dinâmico + SQLite',
  3: 'Sistema web full stack (React + Node.js/Express)',
  4: 'App mobile/PWA + API REST',
  5: 'Plataforma SaaS multi-tenant',
  6: 'Solução cloud de impacto social',
};

/** Equipes (a LGPD decide o que aparece público: só "Equipe DSM — Xº Semestre"). */
export const TEAMS = {
  'team-rota': {
    id: 'team-rota',
    publicLabel: 'Equipe DSM — 4º Semestre',
    members: ['Ana Costa', 'Lucas Silva'],
    advisor: 'Prof. Rafael Martins',
    advisorInitials: 'RM',
    semester: 4,
  },
  'team-biblioteca': {
    id: 'team-biblioteca',
    publicLabel: 'Equipe DSM — 2º Semestre',
    members: ['Marina Lima', 'João Alves', 'Ana Costa', 'Lucas Silva'],
    advisor: 'Prof. Rafael Martins',
    advisorInitials: 'RM',
    semester: 2,
  },
  'team-aquasense': {
    id: 'team-aquasense',
    publicLabel: 'Equipe DSM — 2º Semestre',
    members: ['Beatriz Lima', 'Pedro Alves', 'Caio Nunes', 'Duda Prado'],
    advisor: 'Prof. Rafael Martins',
    advisorInitials: 'RM',
    semester: 2,
  },
  'team-ecocampus': {
    id: 'team-ecocampus',
    publicLabel: 'Equipe DSM — 2º Semestre',
    // Dupla autora do rascunho EcoCampus — mesmos nomes dos protótipos
    // 03 (formulário "Integrantes" e card "Enviado para análise!").
    members: ['Ana Costa', 'Lucas Silva'],
    advisor: 'Prof. Rafael Martins',
    advisorInitials: 'RM',
    semester: 2,
  },
  'team-horta': {
    id: 'team-horta',
    publicLabel: 'Equipe DSM — 4º Semestre',
    members: ['Sofia Reis', 'Téo Barros'],
    advisor: 'Profa. Marta Campos',
    advisorInitials: 'MC',
    semester: 4,
  },
  'team-agua': {
    id: 'team-agua',
    publicLabel: 'Equipe DSM — 3º Semestre',
    members: ['Nina Cardoso', 'Ivo Pires'],
    advisor: 'Profa. Marta Campos',
    advisorInitials: 'MC',
    semester: 3,
  },
};

/**
 * Projetos Integradores do DSM.
 * status: 'rascunho' | 'em-analise' | 'publicado' | 'ajustes'
 */
export const PROJECTS = [
  {
    id: 'prj-rota',
    slug: 'rota-acessivel',
    title: 'Rota Acessível: um campus para todos',
    type: 'Projeto integrador',
    year: 2026,
    semester: 4,
    teamId: 'team-rota',
    status: 'publicado',
    featured: true,
    saves: 24,
    highlights: ['Acessibilidade', 'Tecnologia', 'Inclusão'],
    technologies: ['React.js', 'TypeScript', 'Supabase'],
    description:
      'Uma plataforma para mapear rotas acessíveis no campus, conectando estudantes a trajetos com rampas, piso tátil e elevadores. O projeto combina pesquisa com a comunidade acadêmica e um protótipo navegável para tornar a faculdade mais inclusiva.',
    publishedAt: '02 out. 2026',
    submittedAt: '30 set. 2026',
    image: 'rota-acessivel-hero.jpg',
    files: [
      { id: 'file-rota-1', name: 'Relatório_Rota_Acessível.pdf', kind: 'PDF', size: '2,4 MB', version: 'Versão 2' },
      { id: 'file-rota-2', name: 'Protótipo_Rota_Acessível.zip', kind: 'ZIP', size: '8,1 MB', version: 'Versão 1' },
    ],
    links: {
      live: { label: 'rota-acessivel.example.com', title: 'Projeto · versão navegável', hint: 'Explore as rotas acessíveis do campus' },
      repository: { label: 'github.com/rota-acessivel/campus', title: 'GitHub · código-fonte', hint: 'Repositório de desenvolvimento da equipe' },
      docs: { label: 'notion.com/rota-acessivel/documentacao', title: 'Documentação · portfólio', hint: 'Processo, pesquisa e decisões de projeto' },
    },
    comments: [
      { id: 'cmt-rota-1', author: 'Participante anônimo', initials: null, when: 'Há 2 dias', text: 'Ótima iniciativa! O mapa também contempla o acesso à biblioteca?', team: false },
      { id: 'cmt-rota-2', author: 'Equipe DSM — 4º Semestre', initials: null, when: 'Há 1 dia · Equipe', text: 'Sim! Incluímos a biblioteca e os laboratórios no mapeamento.', team: true },
    ],
    review: {
      decidedAt: '02 out. 2026',
      advisor: 'Prof. Rafael Martins',
      criteria: ['Dados e autoria conferidos', 'Arquivos completos e legíveis', 'Conteúdo adequado ao repositório'],
      comment:
        'Projeto consistente, com pesquisa de campo bem documentada e protótipo funcional. Recomendo a publicação no repositório acadêmico.',
    },
  },
  {
    id: 'prj-biblioteca',
    slug: 'biblioteca-conectada',
    title: 'Biblioteca Conectada: acervo digital',
    type: 'Projeto integrador',
    year: 2026,
    semester: 2,
    teamId: 'team-biblioteca',
    status: 'em-analise',
    featured: false,
    saves: 12,
    highlights: ['Acervo', 'Comunidade', 'Web'],
    technologies: ['React.js', 'Node.js', 'SQLite'],
    description:
      'Portal que conecta o acervo físico da biblioteca a reservas, recomendações e histórico de leitura dos estudantes do DSM, com busca por palavra-chave e devolução simplificada.',
    publishedAt: null,
    submittedAt: '05 out. 2026',
    image: 'biblioteca-hero.jpg',
    files: [
      { id: 'file-biblio-1', name: 'Relatório_Biblioteca_Conectada.pdf', kind: 'PDF', size: '1,8 MB', version: 'Versão 1' },
    ],
    links: {
      live: { label: 'biblioteca-conectada.example.com', title: 'Projeto · versão navegável', hint: 'Teste a busca e as reservas' },
      repository: { label: 'github.com/pi2/biblioteca-conectada', title: 'GitHub · código-fonte', hint: 'Repositório de desenvolvimento da equipe' },
      docs: { label: 'notion.com/pi2/biblioteca/documentacao', title: 'Documentação · portfólio', hint: 'Escopo, cronograma e decisões' },
    },
    comments: [],
    review: null,
  },
  {
    id: 'prj-aquasense',
    slug: 'aquasense',
    title: 'AquaSense: monitoramento da água',
    type: 'Projeto integrador',
    year: 2026,
    semester: 2,
    teamId: 'team-aquasense',
    status: 'em-analise',
    featured: false,
    saves: 9,
    highlights: ['Sensores', 'Ambiente', 'Dados'],
    technologies: ['Python', 'React.js', 'Supabase'],
    description:
      'Sistema de baixo custo para monitorar a qualidade da água com sensores de pH e turbidez. Os dados são reunidos em um painel para apoiar ações de educação ambiental e a identificação de alterações em reservatórios da região.',
    publishedAt: null,
    submittedAt: '03 out. 2026',
    image: 'aquasense-hero.jpg',
    files: [
      { id: 'file-aqua-1', name: 'Relatório_AquaSense.pdf', kind: 'PDF', size: '3,2 MB', version: 'Versão 1' },
      { id: 'file-aqua-2', name: 'Dados_dos_sensores.xlsx', kind: 'XLSX', size: '840 KB', version: 'Versão 1' },
    ],
    links: {
      live: { label: 'aquasense.example.com', title: 'Projeto · versão navegável', hint: 'Painel com leituras em tempo real' },
      repository: { label: 'github.com/pi2/aquasense', title: 'GitHub · código-fonte', hint: 'Firmware e painel da equipe' },
      docs: { label: 'notion.com/pi2/aquasense/documentacao', title: 'Documentação · portfólio', hint: 'Calibração dos sensores e plano de coleta' },
    },
    comments: [],
    review: null,
  },
  {
    id: 'prj-ecocampus',
    slug: 'ecocampus',
    title: 'EcoCampus: gestão de resíduos',
    type: 'Projeto integrador',
    year: 2026,
    semester: 2,
    teamId: 'team-ecocampus',
    // Rascunho (mockup 03 "Meus projetos": card EcoCampus = Rascunho);
    // ao enviar pelo /aluno/novo a página chama
    // updateProjectStatus('ecocampus', 'em-analise') e o card, os
    // contadores e a tela de status passam a mostrar "Em análise".
    status: 'rascunho',
    featured: false,
    saves: 7,
    highlights: ['Sustentabilidade', 'Campus', 'Gestão'],
    technologies: ['React.js', 'Node.js', 'Tailwind CSS'],
    description:
      'Plataforma para acompanhar a coleta seletiva e os pontos de descarte no campus, incentivando práticas sustentáveis na comunidade acadêmica.',
    publishedAt: null,
    submittedAt: '06 out. 2026',
    image: 'ecocampus-hero.jpg',
    files: [
      { id: 'file-eco-1', name: 'Relatório_EcoCampus.pdf', kind: 'PDF', size: '1,8 MB', version: 'Versão 1' },
    ],
    links: {
      live: { label: 'ecocampus.example.com', title: 'Projeto · versão navegável', hint: 'Mapa de pontos de coleta' },
      repository: { label: 'github.com/pi2/ecocampus', title: 'GitHub · código-fonte', hint: 'Código-fonte da plataforma' },
      docs: { label: 'notion.com/pi2/ecocampus/documentacao', title: 'Documentação · portfólio', hint: 'Plano de resíduos do campus' },
    },
    comments: [],
    review: null,
  },
  {
    id: 'prj-horta',
    slug: 'horta-viva',
    title: 'Horta Viva: cultivo e comunidade',
    type: 'Projeto integrador',
    year: 2026,
    semester: 4,
    teamId: 'team-horta',
    status: 'publicado',
    featured: true,
    saves: 32,
    highlights: ['Agricultura', 'Comunidade', 'Dados'],
    technologies: ['React.js', 'TypeScript', 'Docker'],
    description:
      'Aplicação que organiza mutirões de cultivo, calendário de rega e colheitas compartilhadas da horta comunitária do campus, com painel aberto para toda a comunidade acadêmica.',
    publishedAt: '28 set. 2026',
    submittedAt: '26 set. 2026',
    image: 'horta-viva.jpg',
    files: [
      { id: 'file-horta-1', name: 'Relatório_Horta_Viva.pdf', kind: 'PDF', size: '2,1 MB', version: 'Versão 2' },
    ],
    links: {
      live: { label: 'horta-viva.example.com', title: 'Projeto · versão navegável', hint: 'Calendário aberto da horta' },
      repository: { label: 'github.com/pi2/horta-viva', title: 'GitHub · código-fonte', hint: 'Repositório da equipe' },
      docs: { label: 'notion.com/pi2/horta-viva/documentacao', title: 'Documentação · portfólio', hint: 'Registro dos mutirões' },
    },
    comments: [
      { id: 'cmt-horta-1', author: 'Participante anônimo', initials: null, when: 'Há 5 dias', text: 'Conseguem integrar o calendário com o app de notificações da faculdade?', team: false },
    ],
    review: {
      decidedAt: '28 set. 2026',
      advisor: 'Profa. Marta Campos',
      criteria: ['Dados e autoria conferidos', 'Arquivos completos e legíveis', 'Conteúdo adequado ao repositório'],
      comment: 'Boa articulação com a comunidade acadêmica e entrega consistente. Publicado com sucesso.',
    },
  },
  {
    id: 'prj-agua',
    slug: 'agua-em-foco',
    title: 'Água em Foco: qualidade e território',
    type: 'Projeto integrador',
    year: 2026,
    semester: 3,
    teamId: 'team-agua',
    status: 'publicado',
    featured: false,
    saves: 18,
    highlights: ['Ambiente', 'Território', 'Educação'],
    technologies: ['Python', 'Tailwind CSS', 'Supabase'],
    description:
      'Painel educativo que cruza dados públicos de qualidade da água por bairro com conteúdo explicativo para aulas de educação ambiental no campus.',
    publishedAt: '15 set. 2026',
    submittedAt: '12 set. 2026',
    image: 'agua-em-foco.jpg',
    files: [
      { id: 'file-agua-1', name: 'Relatório_Água_em_Foco.pdf', kind: 'PDF', size: '2,9 MB', version: 'Versão 1' },
    ],
    links: {
      live: { label: 'agua-em-foco.example.com', title: 'Projeto · versão navegável', hint: 'Painel público por bairro' },
      repository: { label: 'github.com/pi2/agua-em-foco', title: 'GitHub · código-fonte', hint: 'Scripts de dados e front-end' },
      docs: { label: 'notion.com/pi2/agua-em-foco/documentacao', title: 'Documentação · portfólio', hint: 'Fontes de dados e roteiro didático' },
    },
    comments: [],
    review: {
      decidedAt: '15 set. 2026',
      advisor: 'Profa. Marta Campos',
      criteria: ['Dados e autoria conferidos', 'Arquivos completos e legíveis', 'Conteúdo adequado ao repositório'],
      comment: 'Excelente uso de dados abertos com clareza educativa. Aprovado e publicado.',
    },
  },
];

/** Projetos do aluno logado (Ana) — "Meus projetos". */
export const MY_PROJECT_IDS = ['prj-rota', 'prj-biblioteca', 'prj-ecocampus'];

/** Fila de revisão do professor (Profa./Prof. Rafael). */
export const REVIEW_QUEUE_IDS = ['prj-aquasense', 'prj-biblioteca'];

/** Grupos acompanhados pelo professor (painel / evolução). */
export const ADVISED_GROUP_IDS = ['team-rota', 'team-biblioteca', 'team-ecocampus'];

/** Grupos da gestão de grupos (coordenação) — semestre 2026.2. */
export const GROUPS = [
  {
    id: 'team-ecocampus',
    name: 'EcoCampus',
    semesterLabel: 'DSM · 2º semestre',
    status: 'rascunho',
    members: ['Ana Costa', 'Lucas Silva', '+ 2 alunos'],
    pendingLabel: 'Link de documentação não informado',
    pendingHint: 'Adicione o repositório ou a pasta do projeto.',
    docsUrl: null,
    action: 'Adicionar link de documentação',
    pendingDeliveries: 0,
  },
  {
    id: 'team-biblioteca',
    name: 'Biblioteca Conectada',
    semesterLabel: 'DSM · 2º semestre',
    status: 'em-analise',
    members: ['Marina Lima', 'João Alves', '+ 2 alunos'],
    pendingLabel: '2 entregáveis pendentes',
    pendingHint: null,
    docsUrl: 'github.com/pi2/biblioteca-conectada',
    action: 'Abrir documentação',
    pendingDeliveries: 2,
    extraAction: 'Ver entregáveis pendentes',
  },
  {
    id: 'team-aquasense',
    name: 'AquaSense',
    semesterLabel: 'DSM · 2º semestre',
    status: 'publicado',
    members: ['Beatriz Lima', 'Pedro Alves', '+ 2 alunos'],
    pendingLabel: null,
    pendingHint: null,
    docsUrl: 'github.com/pi2/aquasense',
    action: 'Abrir documentação',
    pendingDeliveries: 0,
  },
  {
    id: 'team-rota',
    name: 'Rota Acessível',
    semesterLabel: 'DSM · 2º semestre',
    status: 'publicado',
    members: ['Luiza Santos', 'Gabriel Rocha', '+ 2 alunos'],
    pendingLabel: null,
    pendingHint: null,
    docsUrl: 'github.com/pi2/rota-acessivel',
    action: 'Abrir documentação',
    pendingDeliveries: 0,
  },
];

/**
 * Evolução do grupo ao longo dos semestres (timeline PBL — qualitativa,
 * sem notas numéricas). Usada em "Histórico e Evolução do Grupo".
 */
export const GROUP_EVOLUTION = {
  groupId: 'team-rota',
  groupLabel: 'Grupo DSM 2026.1',
  groupMeta: 'Sala A · 4 alunos · Período 2026.2',
  updatedNote: 'Dados demonstrativos · Atualizado em 06 out. 2026.',
  timeline: [
    {
      id: 'sem-1',
      tag: '2026.1 · Início',
      title: '1º semestre · Formação do grupo e alinhamento inicial',
      summary: 'Primeiro contato com a disciplina, definição de papéis e apresentação do escopo do projeto.',
      evidence: 'Evidência: apresentação inicial, definição de responsabilidades e primeiro alinhamento com o professor.',
      locked: true,
    },
    {
      id: 'sem-2',
      tag: '2026.2 · Consolidação',
      title: '2º semestre · Entregas intermediárias e ajustes',
      summary: 'Revisão de entregas, feedbacks e ajustes no escopo do projeto.',
      evidence: 'Evidência: entregas intermediárias, registro de feedbacks e ajustes no cronograma.',
      locked: true,
    },
    {
      id: 'sem-3',
      tag: '2027.1 · Planejado',
      title: '3º semestre · Próximos marcos',
      summary: 'Planejamento da próxima etapa: ampliar funcionalidades e preparar a apresentação.',
      evidence: 'Evidências previstas: demonstração da próxima versão e registro da banca. Ainda não anexadas.',
      locked: false,
    },
  ],
  qualitative: [
    {
      id: 'qual-1',
      title: 'Organização e gestão do tempo',
      summary: 'Melhoria na distribuição de tarefas, cumprimento de prazos e alinhamento entre os integrantes.',
      evidence: 'Evidência: cronograma revisado, registros de reuniões e entregas intermediárias.',
    },
    {
      id: 'qual-2',
      title: 'Comunicação e feedback',
      summary: 'Maior clareza nas entregas, melhor registro de feedbacks e ajustes mais rápidos.',
      evidence: 'Evidência: registros de feedbacks, versões revisadas e ajustes documentados.',
    },
  ],
};

/** Evidências da banca já anexadas na entrega do projeto Rota Acessível. */
export const BANCA_EVIDENCE = {
  photos: [
    { id: 'ev-photo-1', name: 'Foto_01.jpg', kind: 'JPG', size: '2,8 MB' },
    { id: 'ev-photo-2', name: 'Foto_02.jpg', kind: 'JPG', size: '3,1 MB' },
  ],
  minutes: [
    { id: 'ev-min-1', name: 'Ata_Avaliação_Banca.pdf', kind: 'PDF', size: '1,2 MB' },
  ],
};

/** Etapas de acompanhamento da análise (área do aluno). */
export const ANALYSIS_STEPS = [
  { id: 'step-sent', title: 'Projeto enviado', state: 'done', meta: '05 out. 2026 · Enviado por Ana Costa ao orientador.' },
  { id: 'step-waiting', title: 'Aguardando orientador', state: 'current', meta: 'O Prof. Rafael Martins ainda não registrou um parecer.' },
  { id: 'step-decision', title: 'Decisão da análise', state: 'todo', meta: 'Próxima etapa · Aprovação ou solicitação de ajustes.' },
  { id: 'step-publish', title: 'Publicação', state: 'todo', meta: 'Disponível à comunidade somente após aprovação.' },
];

/** Quem acompanha a análise (avatares + papéis). */
export const ANALYSIS_WATCHERS = [
  { id: 'usr-ana', name: 'Ana Costa', initials: 'AC', role: 'Autora · Responsável pelo envio', tone: 'neutral' },
  { id: 'usr-lucas', name: 'Lucas Silva', initials: 'LS', role: 'Autor · DSM', tone: 'neutral' },
  { id: 'usr-rafael', name: 'Prof. Rafael Martins', initials: 'RM', role: 'Orientador · Parecer pendente', tone: 'primary' },
];

/* ------------------------------------------------------- helpers de acesso */

export function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id) ?? null;
}

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) ?? null;
}

export function getTeam(project) {
  return project ? TEAMS[project.teamId] ?? null : null;
}

export function getProjectsByIds(ids) {
  return ids.map(getProjectById).filter(Boolean);
}

/**
 * Atualiza o status de um projeto — MOCK EM MEMÓRIA, sem backend.
 * -----------------------------------------------------------------------------
 * O objeto é mutado no próprio array PROJECTS, e getProjectBySlug /
 * getProjectsByIds / getProjectById devolvem exatamente os MESMOS objetos
 * (não cópias): por isso a alteração aparece na hora em "Meus projetos",
 * nos contadores (Publicado / Em análise / Rascunho) e na tela de status.
 *
 * Como não existe persistência, o status volta ao valor original do mock
 * assim que a página é recarregada (F5) — é um comportamento esperado do
 * protótipo estático.
 *
 * @param {string} slug - Slug do projeto, ex.: 'ecocampus'.
 * @param {'rascunho'|'em-analise'|'publicado'|'ajustes'} status - Novo status.
 * @returns {boolean} true se o projeto foi encontrado e atualizado.
 *
 * @example
 * updateProjectStatus('ecocampus', 'em-analise'); // após "Enviar para análise"
 */
export function updateProjectStatus(slug, status) {
  const project = getProjectBySlug(slug);
  if (!project) return false;
  project.status = status;
  return true;
}

/**
 * Regra LGPD: em vistas públicas (vitrine/explorar) o time aparece apenas
 * como "Equipe DSM — Xº Semestre"; nomes só na área logada.
 */
export function teamDisplay(project, { publicView = false } = {}) {
  const team = getTeam(project);
  if (!team) return null;
  return publicView
    ? { primary: team.publicLabel, secondary: COURSE, members: [] }
    : { primary: team.members.join(' e '), secondary: `Orientador: ${team.advisor}`, members: team.members };
}
