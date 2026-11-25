/**
 * PI² — Visão do professor: meu projeto e materiais (rota "/painel/meu-projeto").
 * -----------------------------------------------------------------------------
 * A lista vem de PROJECTS filtrada por ADVISED_GROUP_IDS (que guarda ids de
 * EQUIPE, team-*), ou seja: Rota Acessível (publicado), Biblioteca Conectada
 * (em análise) e EcoCampus (rascunho).
 *
 * Estrutura alinhada ao mockup "Visão Professor — meu projeto e materiais":
 *  • topo — badge "Área do professor", ação "Gerenciar materiais e links",
 *    h1 "Meu projeto e materiais" (igual ao fallback da barra de pilha) e lead;
 *  • cabeçalho de seção — "Projetos sob orientação · N projetos";
 *  • UM BLOCO POR PROJETO — a anatomia de cada bloco (duas colunas no
 *    desktop, pills/status/equipe/documentos/links) vive em
 *    components/staff/ProjectBlock.jsx.
 *
 * Ação por status e imagens do projeto: ver o JSDoc do próprio ProjectBlock
 * (imagens FORA DE ESCOPO — item 16 adiado; usa-se blocos/tokens).
 */
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
      {/* ------------------------------------------ topo */}
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
