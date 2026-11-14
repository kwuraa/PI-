/**
 * PI² — Status da análise do projeto (rota "/aluno/status/:slug").
 * -----------------------------------------------------------------------------
 * Duas telas do protótipo 03 (desktop), selecionadas por ?enviado=1:
 *  • "Enviado para análise!" (enviado=1) — hero com selo "Envio do projeto",
 *    resumo do projeto + aviso "O projeto ainda NÃO está publicado", card
 *    "Enviado ao orientador" (parecer + arquivo) e coluna "E agora?" com
 *    as ações "Acompanhar análise" / "Voltar aos meus projetos";
 *  • "Análise de Biblioteca Conectada" (padrão) — h1 "Status do Projeto",
 *    banner âmbar "Aguardando o parecer do orientador", card "Etapas da
 *    análise" (linha do tempo qualitativa) e coluna com "Quem acompanha" +
 *    "Nenhum parecer registrado" + botão de volta.
 * Linha do tempo e watchers vêm do mock (ANALYSIS_STEPS / ANALYSIS_WATCHERS).
 */
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { FiCheck, FiCircle, FiClock, FiDownload, FiFileText, FiLock, FiSend } from 'react-icons/fi';

import Avatar from '../../components/ui/Avatar/Avatar.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  ANALYSIS_STEPS,
  ANALYSIS_WATCHERS,
  COURSE_SHORT,
  getProjectBySlug,
  getTeam,
  teamDisplay,
} from '../../mocks/projectsMock.js';
import styles from './ProjectStatusPage.module.css';

/** Período letivo exibido nos protótipos desktop (mesmo valor do TopBar). */
const PERIOD = '2026.2';

/** Ícone de cada estado da etapa. */
const STEP_ICONS = {
  done: FiCheck,
  current: FiClock,
  todo: FiCircle,
};

export default function ProjectStatusPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const justSent = searchParams.get('enviado') === '1';
  // "enviado agora" também pode chegar via state (clique em "Acompanhar
  // análise"); o fluxo principal, porém, já grava o status no mock.
  const sentInFlow = location.state?.enviado === true;
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className={styles.page}>
        <Callout tone="danger" title="Projeto não encontrado">
          <Link to="/aluno">Voltar para meus projetos</Link>
        </Callout>
      </div>
    );
  }

  const team = getTeam(project);
  const display = teamDisplay(project);
  // O envio grava 'em-analise' no mock (updateProjectStatus), então esta
  // página lê o status atualizado ao ser aberta sem ?enviado=1 também.
  const inAnalysis = justSent || sentInFlow || project.status === 'em-analise';
  const status = statusMeta(inAnalysis ? 'em-analise' : project.status);
  const author = team?.members?.[0] ?? '';
  const file = project.files?.[0];

  /* ------------------------------------- "Enviado para análise!" */
  if (justSent) {
    return (
      <div className={styles.page}>
        <header className={styles.hero}>
          <span className={styles.heroIcon}>
            <FiSend size={28} aria-hidden="true" />
          </span>
          <div className={styles.heroTexts}>
            <Badge tone="primary">Envio do projeto</Badge>
            <h1 className={styles.heroTitle}>Enviado para análise!</h1>
            <p className={styles.heroLead}>
              Sua ideia deu mais um passo. O {team?.advisor} foi notificado para
              revisar o projeto.
            </p>
          </div>
        </header>

        <div className={styles.split}>
          {/* ----------------------------------- coluna principal */}
          <div className={styles.mainCol}>
            <Card padding="lg" className={styles.sentCard}>
              <Badge tone={status.tone}>{status.label} · Não publicado</Badge>
              <h2 className={styles.sentTitle}>{project.title}</h2>
              <p className={styles.sentMeta}>
                {COURSE_SHORT} · {project.type} · {PERIOD}
              </p>
              <p className={styles.sentTeam}>{display.primary}</p>
              <p className={styles.sentWhen}>
                Enviado em {project.submittedAt} por {author}
              </p>
            </Card>

            <div className={styles.lockBox}>
              <FiLock size={20} aria-hidden="true" />
              <div className={styles.lockBody}>
                <strong className={styles.lockTitle}>
                  O projeto ainda NÃO está publicado
                </strong>
                <p className={styles.lockText}>
                  Por enquanto, somente a equipe e o orientador têm acesso. A
                  comunidade acadêmica só poderá vê-lo após a aprovação.
                </p>
              </div>
            </div>

            <Card padding="lg" className={styles.blockCard}>
              <h2 className={styles.blockTitle}>Enviado ao orientador</h2>
              <div className={styles.advisorRow}>
                <Avatar
                  initials={team?.advisorInitials ?? '—'}
                  tone="primary"
                  size="md"
                />
                <span className={styles.advisorTexts}>
                  <strong>{team?.advisor}</strong>
                  <span>Aguardando análise e parecer</span>
                </span>
              </div>

              {file && (
                <div className={styles.fileRow}>
                  <span className={styles.fileIcon}>
                    <FiFileText size={18} aria-hidden="true" />
                  </span>
                  <span className={styles.fileTexts}>
                    <strong>{file.name}</strong>
                    <span>
                      {file.kind} · {file.size} · Enviado para análise
                    </span>
                  </span>
                  <button
                    type="button"
                    className={styles.fileDownload}
                    aria-label={`Baixar ${file.name}`}
                  >
                    <FiDownload size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* ---------------------------------------- coluna lateral */}
          <aside className={styles.aside}>
            <Card padding="lg" className={styles.blockCard}>
              <h2 className={styles.blockTitle}>E agora?</h2>
              <p className={styles.asideText}>
                O orientador poderá aprovar a publicação ou solicitar ajustes.
                Acompanhe o andamento em Meus projetos e aguarde a notificação
                com o parecer.
              </p>
              <div className={styles.asideActions}>
                <Button
                  icon={<FiClock aria-hidden="true" />}
                  onClick={() =>
                    navigate(`/aluno/status/${project.slug}`, {
                      state: { enviado: true },
                    })
                  }
                >
                  Acompanhar análise
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/aluno')}
                >
                  Voltar aos meus projetos
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    );
  }

  /* ------------------------ "Status do Projeto" (acompanhar análise) */
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTexts}>
          <Badge tone={status.tone}>{status.label}</Badge>
          <h1 className={styles.heroTitle}>Status do Projeto</h1>
          <p className={styles.heroLead}>
            {COURSE_SHORT} · {project.type} · {PERIOD}
          </p>
        </div>
      </header>

      {inAnalysis && (
        <div className={styles.waitBanner}>
          <FiClock size={20} aria-hidden="true" />
          <div className={styles.bannerBody}>
            <strong className={styles.bannerTitle}>
              Aguardando o parecer do orientador
            </strong>
            <p className={styles.bannerText}>
              Seu projeto foi enviado em {project.submittedAt} e ainda está em
              análise. Ele não está publicado no repositório.
            </p>
          </div>
        </div>
      )}

      <div className={styles.split}>
        {/* ------------------------------------ etapas da análise */}
        <Card padding="lg" className={styles.blockCard}>
          <h2 className={styles.blockTitle}>Etapas da análise</h2>
          <ol className={styles.steps}>
            {ANALYSIS_STEPS.map((step) => {
              const Icon = STEP_ICONS[step.state];
              return (
                <li
                  key={step.id}
                  className={`${styles.step} ${styles[step.state]}`}
                >
                  <span className={styles.stepIcon}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div className={styles.stepBody}>
                    <strong className={styles.stepTitle}>{step.title}</strong>
                    <span className={styles.stepMeta}>{step.meta}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* ----------------------------------- quem acompanha + parecer */}
        <aside className={styles.aside}>
          <Card padding="lg" className={styles.blockCard}>
            <h2 className={styles.blockTitle}>Quem acompanha</h2>
            <ul className={styles.watchers}>
              {ANALYSIS_WATCHERS.map((person) => (
                <li key={person.id} className={styles.watcher}>
                  <Avatar
                    initials={person.initials}
                    tone={person.tone === 'primary' ? 'primary' : 'neutral'}
                    size="md"
                  />
                  <span className={styles.watcherTexts}>
                    <strong>{person.name}</strong>
                    <span>{person.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg" className={styles.blockCard}>
            <h2 className={styles.blockTitle}>Nenhum parecer registrado</h2>
            <p className={styles.asideText}>
              Quando o orientador concluir a análise, a decisão aparecerá aqui.
              Você receberá uma notificação sobre a próxima etapa.
            </p>
          </Card>

          <div className={styles.asideAction}>
            <Button variant="secondary" onClick={() => navigate('/aluno')}>
              Voltar aos meus projetos
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
