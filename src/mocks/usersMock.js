/**
 * PI² — Perfis de acesso simulados (MOCK DATA).
 * -----------------------------------------------------------------------------
 * O login NÃO valida senha de verdade: basta escolher um perfil e o sistema
 * "loga" com aquele usuário de demonstração. É o ponto único para alterar
 * quem aparece na tela de "Como você acessa o PI²?".
 *
 * Roles suportadas (RBAC): 'aluno' | 'professor' | 'coordenador' | 'secretaria'.
 * Um usuário pode ter mais de um role (ex.: professor que também coordena).
 */
export const MOCK_USERS = [
  {
    id: 'usr-ana',
    name: 'Ana Costa',
    initials: 'AC',
    roles: ['aluno'],
    email: 'ana.costa@aluno.faculdade.edu.br',
    registration: '202610248',
    course: 'DSM · Desenvolvimento de Software',
    period: '4º período',
    avatarTone: 'primary',
  },
  {
    id: 'usr-rafael',
    name: 'Rafael Martins',
    displayName: 'prof. Rafael',
    initials: 'RM',
    /* Multiperfil (como nos protótipos): atua como professor e coordena.
       O espaço PADRÃO ao entrar é o do professor; a troca acontece na
       tela de Perfil (ver AuthContext.switchSpace). */
    roles: ['professor', 'coordenador'],
    defaultRoles: ['professor'],
    email: 'rafael.martins@faculdade.edu.br',
    course: 'DSM · Desenvolvimento de Software',
    avatarTone: 'neutral',
  },
  {
    id: 'usr-marta',
    name: 'Marta Campos',
    displayName: 'coordenadora Marta',
    initials: 'MC',
    roles: ['coordenador'],
    email: 'marta.campos@faculdade.edu.br',
    course: 'DSM · Desenvolvimento de Software',
    avatarTone: 'neutral',
  },
  {
    id: 'usr-helena',
    name: 'Helena Souza',
    displayName: 'sec. Helena',
    initials: 'HS',
    roles: ['secretaria'],
    email: 'helena.souza@faculdade.edu.br',
    course: 'DSM · Desenvolvimento de Software',
    avatarTone: 'neutral',
  },
];

/** Opções exibidas nos cards de chaveamento do login (Aluno, Professor, Coordenação). */
export const LOGIN_PROFILES = [
  { role: 'aluno', label: 'Aluno', icon: 'graduation' },
  { role: 'professor', label: 'Professor', icon: 'monitor' },
  { role: 'coordenador', label: 'Coordenador', icon: 'sliders' },
];

/** Rótulo do espaço exibido no cabeçalho conforme os roles do usuário. */
export function spaceLabelFor(roles) {
  if (roles.includes('professor') && roles.includes('coordenador')) {
    return 'Coordenador e professor';
  }
  if (roles.includes('professor')) return 'Espaço do professor';
  if (roles.includes('coordenador')) return 'Espaço do coordenador';
  if (roles.includes('secretaria')) return 'Espaço da secretaria';
  return 'Conhecimento conectado';
}

/**
 * Opções do seletor de espaço ativo (troca de perfis simulada).
 * Retorna null quando o usuário tem um único papel (nada a trocar).
 * Cada opção: { roles: [...], label } — o label usa spaceLabelFor.
 */
export function spaceOptionsFor(user) {
  if (!user || user.roles.length < 2) return null;
  const singles = user.roles.map((r) => [r]);
  const full = [user.roles];
  const combos = [...singles, full];
  return combos.map((roles) => ({
    roles,
    label: spaceLabelFor(roles),
  }));
}
