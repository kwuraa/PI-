/**
 * PI² — Meus projetos do aluno (rota "/aluno").
 * Lista os projetos da equipe de Ana com status e ação principal:
 * em análise → "Acompanhar análise"; publicado → "Ver projeto";
 * rascunho → "Continuar edição" (novo formulário).
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import ProjectCard from '../../components/public/ProjectCard/ProjectCard.jsx';
import { MY_PROJECT_IDS, getProjectsByIds } from '../../mocks/projectsMock.js';
import styles from './MyProjectsPage.module.css';

const FILTERS = [
  { value: null, label: 'Todos' },
  { value: 'em-analise', label: 'Em análise' },
  { value: 'publicado', label: 'Publicados' },
];

/** Rótulo + destino da ação principal conforme o status. */
function actionFor(project) {
  if (project.status === 'em-analise') {
    return { label: 'Acompanhar análise', to: `/aluno/status/${project.slug}` };
  }
  if (project.status === 'publicado') {
    return { label: 'Ver projeto', to: `/projeto/${project.slug}` };
  }
  return { label: 'Continuar edição', to: '/aluno/novo' };
}

export default function MyProjectsPage() {
  const projects = getProjectsByIds(MY_PROJECT_IDS);
  const [filter, setFilter] = useState(null);

  const visible =
    filter === null ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Meus projetos"
        subtitle="Acompanhe os projetos da sua equipe e o andamento de cada entrega."
        action={
          <Link to="/aluno/novo" className={styles.newButton}>
            <FiPlus aria-hidden="true" />
            Novo
          </Link>
        }
      />

      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

      <div className={styles.grid}>
        {visible.map((project) => {
          const action = actionFor(project);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              variant="mine"
              action={
                <Link to={action.to} className={styles.action}>
                  {action.label}
                </Link>
              }
            />
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className={styles.empty}>
          Nenhum projeto neste filtro. Crie seu primeiro projeto integrador.
        </p>
      )}
    </div>
  );
}
