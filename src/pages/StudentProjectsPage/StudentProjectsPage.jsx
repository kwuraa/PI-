import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import MiniStat from '../../components/ui/MiniStat/MiniStat';
import ProjectCard from '../../components/ui/ProjectCard/ProjectCard';
import { studentService } from '../../services/studentService';
import { STUDENT_NAV_ITEMS } from '../../config/navigation';
import { Plus } from '../../components/icons';
import './StudentProjectsPage.css';

/**
 * Tela "Meus projetos" (área do aluno).
 * Os dados chegam via studentService — mock hoje, API real amanhã.
 */
export default function StudentProjectsPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const response = await studentService.getMyProjects();
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar seus projetos.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell>
        <p className="student-projects__status" role="status">
          Carregando seus projetos…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p
          className="student-projects__status student-projects__status--error"
          role="alert"
        >
          {error || 'Não foi possível carregar seus projetos.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, stats, section } = data;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="student-projects__intro">
          <Badge>{header.badge}</Badge>
          <h1 className="student-projects__headline">{header.headline}</h1>
          <p className="student-projects__description">{header.description}</p>
        </section>

        <Button fullWidth onClick={() => navigate(header.action.href)}>
          <Plus size={20} /> {header.action.label}
        </Button>

        <div className="student-projects__stats">
          {stats.map((stat) => (
            <MiniStat key={stat.id} value={stat.value} label={stat.label} />
          ))}
        </div>

        <section className="student-projects__section">
          <SectionHeader
            title={section.title}
            actionLabel={`${section.actionLabel} ↓`}
          />

          <div className="student-projects__list">
            {section.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </PageShell>

      <BottomNav items={STUDENT_NAV_ITEMS} />
    </>
  );
}
