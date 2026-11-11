/**
 * PI² — Visão do professor: meu projeto e materiais (rota "/painel/meu-projeto").
 * -----------------------------------------------------------------------------
 * Reúne, para um projeto sob orientação, o resumo, os MATERIAIS (links e
 * arquivos da entrega) e os atalhos de acompanhamento (revisão e evolução).
 * Projeto exibido: o primeiro da lista de orientação (mock).
 */
import { Link } from 'react-router-dom';
import { FiClipboard, FiFileText, FiTrendingUp } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import ListRow from '../../components/ui/ListRow/ListRow.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { statusMeta } from '../../components/public/ProjectCard/ProjectCard.jsx';
import {
  ADVISED_GROUP_IDS,
  getProjectsByIds,
  getTeam,
} from '../../mocks/projectsMock.js';
import styles from './ProfessorProjectPage.module.css';

export default function ProfessorProjectPage() {
  const [project] = getProjectsByIds(ADvised_GROUP_IDS);
  const team = getTeam(project);
  const status = statusMeta(project.status);

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Meu projeto e materiais"
        subtitle="Projeto sob sua orientação, com todos os materiais em um só lugar."
      />

      {/* ---------------------------------------- resumo */}
      <Card padding="md" className={styles.summary}>
        <div className={styles.summaryTop}>
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className={styles.summaryMeta}>{project.semester}º semestre · {project.year}</span>
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <p className={styles.team}>
          {team?.members.join(' e ')} · Orientador(a): {team?.advisor}
        </p>
        <ul className={styles.techs} aria-label="Tecnologias">
          {project.technologies.map((tech) => (
            <li key={tech} className={styles.tech}>
              {tech}
            </li>
          ))}
        </ul>
      </Card>

      {/* -------------------------------------- materiais */}
      <section className={styles.block}>
        <SectionHeader title="Materiais do projeto" />
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

      {/* ------------------------------------ acompanhamento */}
      <section className={styles.block}>
        <SectionHeader title="Acompanhamento" />
        <div className={styles.rows}>
          <ListRow
            icon={<FiClipboard aria-hidden="true" />}
            title="Revisão e parecer"
            hint="Critérios, parecer e decisão sobre a entrega"
            to={`/painel/revisar/${project.slug}`}
          />
          <ListRow
            icon={<FiTrendingUp aria-hidden="true" />}
            title="Histórico e evolução do grupo"
            hint="Linha do tempo qualitativa por semestre"
            to="/painel/evolucao"
          />
        </div>
      </section>

      <Link to="/painel" className={styles.back}>
        Voltar ao painel
      </Link>
    </div>
  );
}
