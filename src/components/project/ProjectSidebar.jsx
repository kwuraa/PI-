import { useNavigate } from 'react-router-dom';
import { FiEye, FiHeart } from 'react-icons/fi';

import Avatar from '../ui/Avatar/Avatar.jsx';
import Badge from '../ui/Badge/Badge.jsx';
import Button from '../ui/Button/Button.jsx';
import Card from '../ui/Card/Card.jsx';
import FileList from '../ui/FileList/FileList.jsx';
import FileRow from '../ui/FileRow/FileRow.jsx';
import SectionHeader from '../ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../utils/status.js';
import { formatNumber } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEngagement } from '../../context/EngagementContext.jsx';
import { COURSE, COURSE_SHORT, getTeam, teamDisplay } from '../../mocks/projectsMock.js';
import styles from './ProjectSidebar.module.css';

export default function ProjectSidebar({ project, isLogged, isOwner }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { viewsFor, likesFor, hasLiked, toggleLike } = useEngagement();

  const team = getTeam(project);
  const display = teamDisplay(project, { publicView: !isLogged });
  const status = statusMeta(project.status);

  /** Métricas públicas do projeto (views da sessão + curtidas totais). */
  const views = viewsFor(project.slug);
  const likes = likesFor(project.slug);
  /** Este usuário logado já curtiu? (só faz sentido com conta). */
  const liked = hasLiked(project.slug, user?.id);

  return (
    <>
      <div className={styles.pills}>
        <Badge tone="primary">{COURSE_SHORT}</Badge>
        <Badge tone={status.tone}>{status.label}</Badge>
        {!isLogged && <Badge tone="neutral">Visualização pública</Badge>}
      </div>

      {/* ------------------------------------------ engajamento
          Views (uma por sessão) + curtidas, visíveis para todos.
          O botão de like é só para PROJETOS PUBLICADOS e quem tem
          conta (aluno/professor…); o visitante vê o convite e a
          EQUIPE dona do projeto não curte o próprio projeto. */}
      <Card padding="md" className={styles.engagementCard}>
        <SectionHeader title="Engajamento" />
        <div className={styles.metrics}>
          <span className={styles.metric}>
            <FiEye aria-hidden="true" />
            <strong>{formatNumber(views)}</strong> visualizações
          </span>
          <span className={styles.metric}>
            <FiHeart aria-hidden="true" />
            <strong>{formatNumber(likes)}</strong> curtidas
          </span>
        </div>

        {project.status === 'publicado' &&
          (isOwner ? (
            /* Regra: a equipe não curte o próprio projeto — a contagem
               é da comunidade. Só a equipe vê a nota (o visitante não
               tem como ser dono). */
            <p className={styles.ownerLikeNote}>
              Projeto da sua equipe — curtir conta para a comunidade.
            </p>
          ) : isLogged ? (
            <Button
              fullWidth
              variant={liked ? 'primary' : 'secondary'}
              icon={
                <FiHeart
                  fill={liked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              }
              onClick={() => toggleLike(project.slug, user.id)}
              aria-pressed={liked}
            >
              {liked ? 'Curtido' : 'Curtir projeto'}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="secondary"
              icon={<FiHeart aria-hidden="true" />}
              onClick={() => navigate('/login')}
            >
              Entre para curtir
            </Button>
          ))}
      </Card>

      <Card padding="md" className={styles.teamCard}>
        <SectionHeader title="Desenvolvido por:" />
        {isLogged ? (
          <>
            <ul className={styles.members}>
              {team.members.map((member) => (
                <li key={member} className={styles.person}>
                  <Avatar
                    initials={member
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                    tone="neutral"
                    size="sm"
                  />
                  <span className={styles.personTexts}>
                    <strong>{member}</strong>
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.person}>
              <Avatar
                initials={team.advisorInitials}
                tone="primary"
                size="sm"
              />
              <span className={styles.personTexts}>
                <strong>{team.advisor}</strong>
                <span>Orientador</span>
              </span>
            </div>
          </>
        ) : (
          <div className={styles.person}>
            <Avatar initials={COURSE_SHORT} tone="primary" size="sm" />
            <span className={styles.personTexts}>
              <strong>{display.primary}</strong>
              <span>{COURSE}</span>
            </span>
          </div>
        )}
      </Card>

      {isLogged && project.files.length > 0 && (
        <Card padding="md" className={styles.filesCard}>
          <SectionHeader title="Arquivos do projeto" />
          <a className={styles.filesCount} href="#arquivos-do-projeto">
            {project.files.length}{' '}
            {project.files.length === 1 ? 'arquivo' : 'arquivos'}
          </a>
          <FileList id="arquivos-do-projeto">
            {project.files.map((file) => (
              <FileRow
                key={file.id}
                name={file.name}
                meta={`${file.kind} · ${file.size}`}
                icon="circle"
                action="download"
                variant="page"
                dense
                truncate
              />
            ))}
          </FileList>
        </Card>
      )}
    </>
  );
}
