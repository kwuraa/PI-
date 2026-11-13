/**
 * PI² — Revisão do projeto pelo professor (rota "/painel/revisar/:slug").
 * -----------------------------------------------------------------------------
 * Tela em DUAS colunas no desktop (mockup 04 · "Revisão de projeto pelo
 * professor"), empilhada no mobile:
 *  • coluna principal — badge de situação ("Aguardando seu parecer") + data
 *    do envio, título, metadados da turma, equipe e orientador, seção
 *    "Resumo do projeto" e seção "Materiais enviados" (arquivos da entrega +
 *    atalho "Link do Projeto", com a contagem à direita);
 *  • coluna lateral — card "Critérios de revisão" (checklist marcável),
 *    bloco "Seu parecer" (rótulo + textarea + instrução), callout
 *    "Você decide a próxima etapa" e as decisões "Aprovar e publicar" /
 *    "Solicitar ajustes" com a nota de notificação da equipe.
 * Estados iniciais reproduzem o mockup: critérios já conferidos e parecer de
 * exemplo preenchido — desmarcar um critério volta a bloquear a aprovação.
 * Imagens do projeto: FORA DE ESCOPO (item 16 adiado).
 * Decisões continuam indo para /painel/resultado/:slug (fluxo inalterado).
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiCheck,
  FiCheckSquare,
  FiDownload,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiSquare,
} from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import { COURSE_SHORT, getProjectBySlug, getTeam } from '../../mocks/projectsMock.js';
import styles from './ReviewPage.module.css';

/** Turma canônica do semestre corrente (mesmo rótulo dos protótipos). */
const TURMA = '2026.2';

/**
 * Checklist QUALITATIVO da revisão (sem notas numéricas) — os três itens
 * exatos do mockup; em projetos já revisados eles aparecem em project.review.
 */
const CRITERIA = [
  'Dados e autoria conferidos',
  'Arquivos completos e legíveis',
  'Conteúdo adequado ao repositório',
];

/** Parecer de exemplo do mockup (estado inicial preenchido do textarea). */
const EXAMPLE_COMMENT =
  'O projeto apresenta metodologia clara e resultados bem documentados. Os arquivos estão completos e o conteúdo contribui para as pesquisas em monitoramento ambiental. Recomendo a publicação.';

export default function ReviewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  // Estado inicial igual ao mockup: critérios conferidos + parecer de exemplo.
  const [checked, setChecked] = useState(CRITERIA);
  const [comment, setComment] = useState(EXAMPLE_COMMENT);

  if (!project) {
    return (
      <div className={styles.page}>
        <Button variant="secondary" onClick={() => navigate('/painel')}>
          Voltar ao painel
        </Button>
      </div>
    );
  }

  const team = getTeam(project);
  const status = statusMeta(project.status);
  const allChecked = checked.length === CRITERIA.length;
  const canApprove = allChecked && comment.trim().length > 0;

  /** Situação exibida no badge (mockup: "Aguardando seu parecer"). */
  const situation =
    project.status === 'em-analise'
      ? { label: 'Aguardando seu parecer', tone: 'warning' }
      : status;

  const toggleCriterion = (item) =>
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );

  const go = (decision) =>
    navigate(`/painel/resultado/${project.slug}${decision}`);

  return (
    <div className={styles.page}>
      {/* ------------------------------------- coluna principal */}
      <div className={styles.main}>
        <div className={styles.statusRow}>
          <Badge tone={situation.tone}>{situation.label}</Badge>
          <span className={styles.statusDate}>{project.submittedAt}</span>
        </div>

        <div className={styles.identity}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.meta}>
            {COURSE_SHORT} · {project.type} · {TURMA}
          </p>
          <p className={styles.team}>{team?.members.join(' e ')}</p>
          <p className={styles.advisor}>Orientador: {team?.advisor}</p>
        </div>

        <section className={styles.block}>
          <SectionHeader title="Resumo do projeto" />
          <p className={styles.description}>{project.description}</p>
        </section>

        <section className={styles.block}>
          <SectionHeader
            title="Materiais enviados"
            action={
              <span className={styles.fileCount}>
                {project.files.length} arquivos
              </span>
            }
          />
          <ul className={styles.files}>
            {project.files.map((file) => (
              <li key={file.id} className={styles.file}>
                <FiFileText className={styles.fileIcon} aria-hidden="true" />
                <span className={styles.fileText}>
                  <strong>{file.name}</strong>
                  <small>
                    {file.kind} · {file.size} · {file.version}
                  </small>
                </span>
                <FiDownload className={styles.fileDownload} aria-hidden="true" />
              </li>
            ))}
            {project.links.live && (
              <li>
                <a
                  className={styles.file}
                  href={`https://${project.links.live.label}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiFileText className={styles.fileIcon} aria-hidden="true" />
                  <span className={styles.fileText}>
                    <strong>Link do Projeto</strong>
                  </span>
                  <FiDownload
                    className={styles.fileDownload}
                    aria-hidden="true"
                  />
                </a>
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* --------------------------------------- coluna lateral */}
      <aside className={styles.side}>
        <Card padding="md" className={styles.sideCard}>
          <h2 className={styles.sideTitle}>Critérios de revisão</h2>
          <ul className={styles.criteria}>
            {CRITERIA.map((item) => {
              const done = checked.includes(item);
              return (
                <li key={item}>
                  <label className={styles.criterion}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleCriterion(item)}
                    />
                    <span className={styles.criterionIcon} aria-hidden="true">
                      {done ? (
                        <FiCheckSquare size={18} />
                      ) : (
                        <FiSquare size={18} />
                      )}
                    </span>
                    <span>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Card>

        <section className={styles.parecer}>
          <h2 className={styles.sideTitle}>Seu parecer</h2>
          <label className={styles.textareaLabel} htmlFor="parecer">
            Comentário para a equipe *
          </label>
          <textarea
            id="parecer"
            className={styles.textarea}
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <p className={styles.textareaHint}>
            Este parecer será enviado aos autores e ficará no histórico do
            projeto.
          </p>
        </section>

        <Callout
          tone="danger"
          icon={<FiShield size={22} aria-hidden="true" />}
          title="Você decide a próxima etapa"
        >
          Ao aprovar, o projeto será publicado para a comunidade acadêmica. Se
          solicitar ajustes, informe o que precisa ser revisado.
        </Callout>

        <div className={styles.decisions}>
          <Button
            size="lg"
            fullWidth
            icon={<FiCheck aria-hidden="true" />}
            disabled={!canApprove}
            onClick={() => go('')}
          >
            Aprovar e publicar
          </Button>
          <Button
            size="lg"
            variant="secondary"
            fullWidth
            icon={<FiMessageSquare aria-hidden="true" />}
            disabled={!comment.trim()}
            onClick={() => go('?decisao=ajustes')}
          >
            Solicitar ajustes
          </Button>
          <p className={styles.decisionNote}>
            A equipe será notificada sobre sua decisão.
          </p>
        </div>
      </aside>
    </div>
  );
}
