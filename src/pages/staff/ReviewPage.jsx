/**
 * PI² — Revisão do projeto pelo professor (rota "/painel/revisar/:slug").
 * -----------------------------------------------------------------------------
 * Fluxo do professor: ler a entrega (links + arquivos), marcar os critérios
 * QUALITATIVOS (sem notas numéricas), escrever o parecer e decidir:
 *  • "Aprovar e publicado" → /painel/resultado/:slug
 *  • "Solicitar ajustes"   → /painel/resultado/:slug?decisao=ajustes
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiFileText } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import { getProjectBySlug, getTeam } from '../../mocks/projectsMock.js';
import styles from './ReviewPage.module.css';

/** Critérios qualitativos da revisão (checklist — nada de notas). */
const CRITERIA = [
  'Dados e autoria conferidos',
  'Arquivos completos e legíveis',
  'Links da entrega acessíveis',
  'Conteúdo adequado ao repositório acadêmico',
];

export default function ReviewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  const [checked, setChecked] = useState([]);
  const [comment, setComment] = useState('');

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

  const toggleCriterion = (item) =>
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );

  const go = (decision) =>
    navigate(`/painel/resultado/${project.slug}${decision}`);

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------- resumo */}
      <Card padding="md" className={styles.summary}>
        <div className={styles.summaryTop}>
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className={styles.summaryMeta}>Enviado em {project.submittedAt}</span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <p className={styles.team}>
          Equipe: {team?.members.join(' e ')} · Orientador(a): {team?.advisor}
        </p>
      </Card>

      {/* ----------------------------------------- entrega */}
      <section className={styles.block}>
        <SectionHeader title="Links da entrega" />
        <div className={styles.links}>
          {Object.entries(project.links).map(([key, link]) => (
            <a
              key={key}
              className={styles.link}
              href={`https://${link.label}`}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{link.title}</strong>
              <code>{link.label}</code>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <SectionHeader title="Arquivos entregues" />
        <ul className={styles.files}>
          {project.files.map((file) => (
            <li key={file.id} className={styles.file}>
              <FiFileText aria-hidden="true" />
              <span>
                <strong>{file.name}</strong> · {file.kind} · {file.size} · {file.version}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------- critérios */}
      <section className={styles.block}>
        <SectionHeader
          title="Critérios de análise"
          subtitle="Checklist qualitativo — sem notas numéricas."
        />
        <ul className={styles.criteria}>
          {CRITERIA.map((item) => {
            const done = checked.includes(item);
            return (
              <li key={item}>
                <label className={`${styles.criterion} ${done ? styles.criterionDone : ''}`}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleCriterion(item)}
                  />
                  <span>{item}</span>
                  {done && <FiCheckCircle className={styles.criterionIcon} aria-hidden="true" />}
                </label>
              </li>
            );
          })}
        </ul>
        <p className={styles.progress}>
          {checked.length} de {CRITERIA.length} critérios conferidos
        </p>
      </section>

      {/* ---------------------------------------- parecer */}
      <section className={styles.block}>
        <SectionHeader title="Parecer do orientador" />
        <textarea
          className={styles.textarea}
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Descreva os pontos fortes, ajustes necessários e a decisão sobre o projeto…"
        />
        {!allChecked && (
          <p className={styles.validation}>Marque todos os critérios para decidir.</p>
        )}
      </section>

      {/* ---------------------------------------- decisão */}
      <div className={styles.decisions}>
        <Button
          size="lg"
          disabled={!canApprove}
          onClick={() => go('')}
        >
          Aprovar e publicar
        </Button>
        <Button
          size="lg"
          variant="secondary"
          disabled={!comment.trim()}
          onClick={() => go('?decisao=ajustes')}
        >
          Solicitar ajustes
        </Button>
      </div>

      <Link to="/painel" className={styles.back}>
        Voltar ao painel
      </Link>
    </div>
  );
}
