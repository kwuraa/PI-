/**
 * PI² — Visão do professor: meu projeto e materiais (rota "/painel/meu-projeto").
 * -----------------------------------------------------------------------------
 * A tela lista TODOS os projetos sob orientação do professor — a lista vem de
 * PROJECTS filtrada por ADVISED_GROUP_IDS (que guarda ids de EQUIPE, team-*),
 * ou seja: Rota Acessível (publicado), Biblioteca Conectada (em análise) e
 * EcoCampus (rascunho).
 *
 * Estrutura alinhada ao mockup "Visão Professor — meu projeto e materiais"
 * (mesma anatomia da tela "Meu projeto"), repetida UM BLOCO POR PROJETO:
 *  • topo — badge "Área do professor" + ação "Gerenciar materiais e links",
 *    h1 "Meu projeto e materiais" (igual ao fallback da barra de pilha) e lead;
 *  • cabeçalho de seção — "Projetos sob orientação · N projetos";
 *  • por projeto, em DUAS colunas no desktop (≥1024) e empilhada no mobile:
 *    - coluna principal — pills (DSM + status), título, meta (tipo · turma ·
 *      publicação/envio · salvos), equipe e orientador, ação coerente com o
 *      status, card "Sobre o projeto" (descrição + destaques), card "Meus
 *      documentos · N arquivos" e o callout "Seus materiais, acessos diferentes";
 *    - coluna lateral sticky — "Links do projeto" com os cards "Projeto ·
 *      versão navegável" e "GitHub · código-fonte" + nota de aprovação
 *      (exibida apenas quando o projeto está publicado).
 *
 * Ação por status: publicado → /projeto/:slug; em análise → /painel/revisar/
 * :slug; ajustes → /painel/resultado/:slug; rascunho → /painel/grupos (a
 * equipe ainda não enviou o projeto, então a referência é a ficha do grupo).
 * Imagens do projeto: FORA DE ESCOPO (item 16 adiado) — usa-se blocos/tokens.
 */
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiDownload,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiLock,
  FiUsers,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  ADVISED_GROUP_IDS,
  COURSE_SHORT,
  PROJECTS,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './ProfessorProjectPage.module.css';

/** Turma canônica do semestre corrente (mesmo rótulo dos protótipos). */
const TURMA = '2026.2';

/**
 * Projetos sob orientação do professor.
 * ADVISED_GROUP_IDS guarda ids de EQUIPE (team-*), então o filtro é por
 * `teamId` (e não por id de projeto — `getProjectsByIds` devolveria []).
 */
const ADVISED_PROJECTS = PROJECTS.filter((project) =>
  ADVISED_GROUP_IDS.includes(project.teamId),
);

/** Data por situação: publicado usa a data de publicação; senão, de envio. */
function dateLineFor(project) {
  if (project.status === 'publicado') return `Publicado em ${project.publishedAt}`;
  if (project.status === 'rascunho') return `Rascunho salvo em ${project.submittedAt}`;
  return `Enviado em ${project.submittedAt}`;
}

/**
 * Ação principal do bloco, coerente com o status do projeto
 * (rótulo, rota real e ícone — nenhum destino "falso").
 */
function actionFor(project) {
  switch (project.status) {
    case 'publicado':
      return {
        label: 'Ver projeto',
        to: `/projeto/${project.slug}`,
        Icon: FiExternalLink,
        hint: 'Página pública do projeto na vitrine.',
      };
    case 'em-analise':
      return {
        label: 'Revisar projeto',
        to: `/painel/revisar/${project.slug}`,
        Icon: FiArrowRight,
        hint: 'Envio aguardando o seu parecer.',
      };
    case 'ajustes':
      return {
        label: 'Ver resultado da análise',
        to: `/painel/resultado/${project.slug}`,
        Icon: FiArrowRight,
        hint: 'Ajustes solicitados à equipe.',
      };
    default:
      // Rascunho: ainda não há envio para revisar — a referência é a ficha
      // do grupo na gestão (é lá que o rascunho aparece).
      return {
        label: 'Ver grupo na gestão',
        to: '/painel/grupos',
        Icon: FiUsers,
        hint: 'A equipe ainda não enviou o projeto para análise.',
      };
  }
}

/** Nota de aprovação da coluna de links — apenas para projetos publicados. */
function approvalNoteFor(project) {
  if (project.status !== 'publicado') return null;
  return `Projeto aprovado em ${project.publishedAt}. Acompanhe o parecer no histórico de revisão.`;
}

/** Bloco completo de UM projeto (anatomia do mockup 09). */
function ProjectBlock({ project }) {
  const team = getTeam(project);
  const status = statusMeta(project.status);
  const live = project.links.live;
  const repository = project.links.repository;
  const action = actionFor(project);
  const approvalNote = approvalNoteFor(project);
  const ActionIcon = action.Icon;
  const headingId = `projeto-${project.id}`;

  return (
    <article className={styles.project} aria-labelledby={headingId}>
      <div className={styles.grid}>
        {/* ---------------------------------- coluna principal */}
        <div className={styles.main}>
          <div className={styles.identity}>
            <div className={styles.badgesRow}>
              <Badge tone="primary">{COURSE_SHORT}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <h3 id={headingId} className={styles.projectTitle}>
              {project.title}
            </h3>
            <div className={styles.meta}>
              <p>
                {project.type} · Turma {TURMA}
              </p>
              <p>
                {dateLineFor(project)} · {project.saves} salvos
              </p>
            </div>
            <p className={styles.team}>{team?.members.join(' e ')}</p>
            <p className={styles.advisor}>Orientador: {team?.advisor}</p>

            {/* ação coerente com o status (ver actionFor) */}
            <div className={styles.actions}>
              <Link to={action.to} className={styles.actionLink}>
                <Button variant="secondary" icon={<ActionIcon aria-hidden="true" />}>
                  {action.label}
                </Button>
              </Link>
              <span className={styles.actionHint}>{action.hint}</span>
            </div>
          </div>

          <Card padding="md" className={styles.card}>
            <h4 className={styles.cardTitle}>Sobre o projeto</h4>
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.tags} aria-label="Destaques do projeto">
              {project.highlights.map((highlight) => (
                <li key={highlight} className={styles.tag}>
                  {highlight}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md" className={styles.card}>
            <h4 className={styles.cardTitle}>
              Meus documentos · {project.files.length} arquivos
            </h4>
            <ul className={styles.files}>
              {project.files.map((file) => (
                <li key={file.id} className={styles.file}>
                  <span className={styles.fileIcon}>
                    <FiFileText aria-hidden="true" />
                  </span>
                  <span className={styles.fileText}>
                    <strong>{file.name}</strong>
                    <small>
                      {file.kind} · {file.size}
                    </small>
                  </span>
                  <FiDownload className={styles.fileDownload} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Card>

          <Callout
            tone="danger"
            icon={<FiLock size={22} aria-hidden="true" />}
            title="Seus materiais, acessos diferentes"
          >
            Na visualização pública, ficam disponíveis o relatório para leitura
            e o link do projeto. O repositório e o ZIP não são exibidos.
          </Callout>
        </div>

        {/* ---------------------------------------- coluna lateral */}
        <aside
          className={styles.side}
          aria-label={`Links do projeto ${project.title}`}
        >
          <h4 className={styles.sideTitle}>Links do projeto</h4>

          {live && (
            <Card padding="md" className={styles.linkCard}>
              <strong className={styles.linkTitle}>{live.title}</strong>
              <p className={styles.linkHint}>{live.hint}</p>
              <code className={styles.linkLabel}>{live.label}</code>
              <a
                href={`https://${live.label}`}
                target="_blank"
                rel="noreferrer"
                className={styles.linkAnchor}
              >
                <Button fullWidth icon={<FiExternalLink aria-hidden="true" />}>
                  Acessar projeto
                </Button>
              </a>
            </Card>
          )}

          {repository && (
            <Card padding="md" className={styles.linkCard}>
              <strong className={styles.linkTitle}>{repository.title}</strong>
              <p className={styles.linkHint}>{repository.hint}</p>
              <code className={styles.linkLabel}>{repository.label}</code>
              <a
                href={`https://${repository.label}`}
                target="_blank"
                rel="noreferrer"
                className={styles.linkAnchor}
              >
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<FiExternalLink aria-hidden="true" />}
                >
                  Abrir repositório no GitHub
                </Button>
              </a>
            </Card>
          )}

          {approvalNote && (
            <p className={styles.approvalNote}>{approvalNote}</p>
          )}
        </aside>
      </div>
    </article>
  );
}

export default function ProfessorProjectPage() {
  return (
    <div className={styles.page}>
      {/* ------------------------------------------ topo */}
      <header className={styles.head}>
        <div className={styles.headTop}>
          <Badge tone="primary">Área do professor</Badge>
          <Button variant="secondary" icon={<FiEdit3 aria-hidden="true" />}>
            Gerenciar materiais e links
          </Button>
        </div>
        <h1 className={styles.title}>Meu projeto e materiais</h1>
        <p className={styles.lead}>
          Seus documentos, materiais e links de cada projeto sob sua orientação,
          reunidos em um só lugar.
        </p>
      </header>

      {/* --------------------------------- seção de projetos */}
      <section
        className={styles.section}
        aria-labelledby="projetos-sob-orientacao"
      >
        <div className={styles.sectionHead}>
          <h2 id="projetos-sob-orientacao" className={styles.sectionTitle}>
            Projetos sob orientação · {ADVISED_PROJECTS.length} projetos
          </h2>
          <p className={styles.sectionHint}>
            Um bloco por projeto: status, equipe, documentos e links de apoio.
          </p>
        </div>

        {ADVISED_PROJECTS.length === 0 ? (
          <p className={styles.sectionHint}>
            Nenhum projeto sob sua orientação no momento.
          </p>
        ) : (
          <div className={styles.projects}>
            {ADVISED_PROJECTS.map((project) => (
              <ProjectBlock key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
