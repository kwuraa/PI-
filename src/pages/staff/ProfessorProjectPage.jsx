import { FiEdit3 } from 'react-icons/fi';

import ProjectBlock from '../../components/staff/ProjectBlock.jsx';
import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import PageHeader from '../../components/ui/PageHeader/PageHeader.jsx';
import { ADVISED_GROUP_IDS, PROJECTS } from '../../mocks/projectsMock.js';
import styles from './ProfessorProjectPage.module.css';

/**
 * Projetos sob orientação do professor.
 * ADVISED_GROUP_IDS guarda ids de EQUIPE (team-*), então o filtro é por
 * `teamId` (e não por id de projeto — `getProjectsByIds` devolveria []).
 */
const ADVISED_PROJECTS = PROJECTS.filter((project) =>
  ADVISED_GROUP_IDS.includes(project.teamId),
);

export default function ProfessorProjectPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        actionsTop
        gap="sm"
        titleLine="normal"
        className={styles.pageHeader}
        eyebrow={<Badge tone="primary">Área do professor</Badge>}
        actions={
          <Button variant="secondary" icon={<FiEdit3 aria-hidden="true" />}>
            Gerenciar materiais e links
          </Button>
        }
        title="Meu projeto e materiais"
        lead="Seus documentos, materiais e links de cada projeto sob sua orientação, reunidos em um só lugar."
      />

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
