import { PROJECTS, getTeam } from '../mocks/projectsMock.js';
import { statusMeta } from './status.js';

/** Remove o tratamento ("Prof."/"Profa.") e normaliza o nome do orientador. */
function normalizedName(name = '') {
  return name
    .replace(/^prof(a)?\.?\s*/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Projetos de PI cadastrados sob a orientação do usuário logado.
 * O vínculo é o `advisor` da equipe em TEAMS — o mesmo nome civil do usuário
 * em MOCK_USERS, com ou sem o prefixo "Prof."/"Profa.".
 */
export function getAdvisedProjects(user) {
  if (!user?.roles?.includes('professor')) return [];

  const advisor = normalizedName(user.name);
  if (!advisor) return [];

  return PROJECTS.filter((project) => {
    const team = getTeam(project);
    return team && normalizedName(team.advisor) === advisor;
  });
}

/** Etapa de análise: usa o parecer do mock quando ele existe. */
function analysisStep(project, status) {
  const review = project.review;

  if (!review) {
    return {
      id: `${project.id}-analise`,
      tag: 'Em acompanhamento',
      title: 'Análise do orientador',
      summary:
        project.status === 'rascunho'
          ? 'O projeto ainda está em rascunho e não foi enviado para análise.'
          : 'O envio foi registrado, mas o parecer do orientador ainda não foi registrado.',
      evidence: `Situação atual: ${status.label}.`,
      locked: false,
    };
  }

  return {
    id: `${project.id}-analise`,
    tag: `Parecer · ${review.decidedAt ?? 'registrado'}`,
    title: 'Análise do orientador',
    summary: review.comment,
    evidence: `Critérios avaliados: ${review.criteria.join(' · ')}.`,
    locked: true,
  };
}

/** Etapa final do histórico, conforme o status atual do projeto. */
function outcomeStep(project, status) {
  if (project.status === 'publicado') {
    return {
      id: `${project.id}-desfecho`,
      tag: `Publicação · ${project.publishedAt ?? 'data não informada'}`,
      title: 'Projeto publicado no repositório',
      summary:
        'O projeto foi aprovado e disponibilizado à comunidade acadêmica.',
      evidence: project.review?.comment
        ? `Parecer: ${project.review.comment}`
        : 'Registro de aprovação não anexado.',
      locked: true,
    };
  }

  if (project.status === 'ajustes') {
    return {
      id: `${project.id}-desfecho`,
      tag: 'Ajustes solicitados',
      title: 'Ajustes solicitados à equipe',
      summary: 'A análise concluiu pela necessidade de ajustes no projeto.',
      evidence: project.review?.comment
        ? `Parecer: ${project.review.comment}`
        : 'Solicitação de ajustes ainda sem parecer detalhado.',
      locked: true,
    };
  }

  return {
    id: `${project.id}-desfecho`,
    tag: 'Próxima etapa',
    title: 'Aguardando decisão da análise',
    summary: 'Ainda não há desfecho registrado para este envio.',
    evidence: `Situação atual: ${status.label}.`,
    locked: false,
  };
}

/**
 * Monta o relatório de um projeto a partir dos dados do cadastro (mock).
 * Nenhum conteúdo é fixo por grupo: histórico, evidências e documentos vêm
 * do próprio projeto selecionado.
 */
export function buildProjectReport(project) {
  const team = getTeam(project);
  const status = statusMeta(project.status);
  const files = project.files ?? [];
  const documentNames = files.map((file) => file.name).join(' · ');
  const review = project.review;

  return {
    id: project.id,
    title: project.title,
    projectMeta: `${project.type} · ${project.semester}º semestre · ${project.year}`,
    semesterLabel: `${project.semester}º Semestre / ${project.year}`,
    evaluationDate: `___ / ___ / ${project.year}`,
    advisor: team?.advisor ?? 'Não informado',
    members: team?.members ?? [],
    status,
    groupLabel: team?.publicLabel ?? 'Equipe DSM',
    groupMeta: [
      team?.members?.join(' · '),
      team?.advisor && `Orientador: ${team.advisor}`,
    ]
      .filter(Boolean)
      .join(' · '),
    updatedNote: `Dados do cadastro do projeto · Atualizado em ${
      project.publishedAt ?? project.submittedAt ?? 'data não informada'
    }.`,
    files,
    timeline: [
      {
        id: `${project.id}-envio`,
        tag: `Envio · ${project.submittedAt ?? 'data não informada'}`,
        title: 'Projeto enviado para acompanhamento',
        summary: `A equipe cadastrou o projeto ${project.title}.`,
        evidence: `Documentos entregues: ${
          documentNames || 'nenhum arquivo anexado até o momento'
        }.`,
        locked: true,
      },
      analysisStep(project, status),
      outcomeStep(project, status),
    ],
    qualitative: [
      {
        id: `${project.id}-qual-1`,
        title: 'Organização e gestão do tempo',
        summary: `Acompanhamento de ${team?.members?.length ?? 0} integrantes ao longo do ${project.semester}º semestre.`,
        evidence: `Evidências: ${
          documentNames || 'sem arquivos anexados até o momento'
        }.`,
      },
      {
        id: `${project.id}-qual-2`,
        title: 'Comunicação e feedback',
        summary: review
          ? review.comment
          : 'Ainda não há parecer registrado pelo orientador para este projeto.',
        evidence: review
          ? `Critérios avaliados: ${review.criteria.join(' · ')}.`
          : `Situação atual: ${status.label}.`,
      },
    ],
  };
}
