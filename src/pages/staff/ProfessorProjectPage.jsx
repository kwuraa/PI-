/**
 * PI² — Visão do professor: meu projeto e materiais (rota "/painel/meu-projeto").
 * -----------------------------------------------------------------------------
 * Estrutura alinhada ao mockup "Visão Professor — meu projeto e materiais"
 * (mesma anatomia da tela "Meu projeto", com a marcação do ESPAÇO DO
 * PROFESSOR), em DUAS colunas no desktop e empilhada no mobile:
 *  • topo — badge "Área do professor" + ação "Gerenciar materiais e links",
 *    título "Meu projeto" e o lead do protótipo;
 *  • coluna principal — identidade do projeto (selo do curso + status,
 *    título, tipo · turma · publicação · salvos, equipe e orientador),
 *    card "Sobre o projeto" (descrição + destaques), card "Meus documentos ·
 *    N arquivos" e o callout "Seus materiais, acessos diferentes";
 *  • coluna lateral — "Links do projeto" com os cards "Projeto · versão
 *    navegável" e "GitHub · código-fonte" + nota de aprovação.
 * Projeto exibido: o primeiro da lista de orientação (mock).
 * Imagens do projeto: FORA DE ESCOPO (item 16 adiado).
 */
import {
  FiDownload,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiLock,
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

export default function ProfessorProjectPage() {
  // ADVISED_GROUP_IDS guarda ids de EQUIPE (team-*): o projeto é o primeiro
  // cujo time pertence à lista de orientação.
  const project = PROJECTS.find((p) => ADVISED_GROUP_IDS.includes(p.teamId));
  const team = getTeam(project);
  const status = statusMeta(project.status);
  const live = project.links.live;
  const repository = project.links.repository;

  /** Data por situação: publicado usa a data de publicação; senão, de envio. */
  const dateLine =
    project.status === 'publicado'
      ? `Publicado em ${project.publishedAt}`
      : `Enviado em ${project.submittedAt}`;

  /** Nota de rodapé da coluna de links (copy do mockup). */
  const approvalNote =
    project.status === 'publicado'
      ? `Projeto aprovado em ${project.publishedAt}. Acompanhe o parecer no histórico de revisão.`
      : 'Acompanhe o parecer no histórico de revisão.';

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
        <h1 className={styles.title}>Meu projeto</h1>
        <p className={styles.lead}>
          Seus documentos, materiais e links, reunidos em um só lugar.
        </p>
      </header>

      <div className={styles.grid}>
        {/* ----------------------------------- coluna principal */}
        <div className={styles.main}>
          <div className={styles.identity}>
            <div className={styles.badgesRow}>
              <Badge tone="primary">{COURSE_SHORT}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            <div className={styles.meta}>
              <p>
                {project.type} · Turma {TURMA}
              </p>
              <p>
                {dateLine} · {project.saves} salvos
              </p>
            </div>
            <p className={styles.team}>{team?.members.join(' e ')}</p>
            <p className={styles.advisor}>Orientador: {team?.advisor}</p>
          </div>

          <Card padding="md" className={styles.card}>
            <h3 className={styles.cardTitle}>Sobre o projeto</h3>
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
            <h3 className={styles.cardTitle}>
              Meus documentos · {project.files.length} arquivos
            </h3>
            <ul className={styles.files}>
              {project.files.map((file) => (
                <li key={file.id} className={styles.file}>
                  <FiFileText className={styles.fileIcon} aria-hidden="true" />
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

        {/* ------------------------------------- coluna lateral */}
        <aside className={styles.side}>
          <h3 className={styles.sideTitle}>Links do projeto</h3>

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

          <p className={styles.approvalNote}>{approvalNote}</p>
        </aside>
      </div>
    </div>
  );
}
