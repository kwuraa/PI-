import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import FileCard from '../../components/ui/FileCard/FileCard';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import { ExternalLink, Github, PencilLine } from '../../components/icons';
import { studentService } from '../../services/studentService';
import { STUDENT_NAV_ITEMS } from '../../config/navigation';
import './MyProjectPage.css';

const LINK_ICONS = {
  external: ExternalLink,
  github: Github,
};

/**
 * Tela "Meu projeto" (/meus-projetos/:slug) — visão do autor.
 * Mostra todos os materiais e links (inclusive internos) e explica
 * o que muda na visualização pública.
 */
export default function MyProjectPage() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await studentService.getMyProject(slug);
        if (active) setData(response);
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <p className="my-project__status" role="status">
          Carregando projeto…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="my-project__status my-project__status--error" role="alert">
          {error || 'Não foi possível carregar o projeto.'}
        </p>
      </PageShell>
    );
  }

  const { header, project, about, materials, linksSectionTitle, links, notice } =
    data;

  return (
    <>
      <div className="my-project__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="my-project__intro">
          <Badge>{header.badge}</Badge>
        </section>

        {project.heroImage && (
          <img className="my-project__hero-image" src={project.heroImage} alt="" />
        )}

        <section className="my-project__project">
          <div className="my-project__badges">
            <Badge>{project.courseBadge}</Badge>
            <Badge tone={project.statusBadge.tone}>
              {project.statusBadge.label}
            </Badge>
          </div>

          <h1 className="my-project__title">{project.title}</h1>
          <p className="my-project__meta">{project.meta}</p>
          <p className="my-project__meta">{project.publishedLine}</p>
          <strong className="my-project__authors">{project.authors}</strong>
          <p className="my-project__advisor">{project.advisor}</p>
        </section>

        <section className="my-project__section">
          <h2 className="my-project__heading">{about.title}</h2>
          <p className="my-project__text">{about.description}</p>
          <ul className="my-project__tags">
            {about.tags.map((tag) => (
              <li className="my-project__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section className="my-project__section">
          <SectionHeader
            title={materials.title}
            actionLabel={materials.actionLabel}
          />
          <ul className="my-project__files">
            {materials.items.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        <section className="my-project__section">
          <h2 className="my-project__heading">{linksSectionTitle}</h2>

          {links.map((link) => {
            const LinkIcon = LINK_ICONS[link.icon] || ExternalLink;

            return (
              <article className="my-project__link" key={link.id}>
                <header className="my-project__link-header">
                  <span className="my-project__link-icon" aria-hidden="true">
                    <LinkIcon size={20} />
                  </span>
                  <span className="my-project__link-text">
                    <strong className="my-project__link-title">
                      {link.title}
                    </strong>
                    <span className="my-project__link-description">
                      {link.description}
                    </span>
                  </span>
                </header>
                <p className="my-project__link-url">{link.url}</p>
                <Button
                  variant={link.variant === 'primary' ? 'primary' : 'secondary'}
                  fullWidth
                >
                  <ExternalLink size={18} /> {link.actionLabel}
                </Button>
              </article>
            );
          })}
        </section>

        <AlertCard
          icon={notice.icon}
          tone={notice.tone}
          title={notice.title}
          description={notice.description}
        />

        <Button variant="secondary" fullWidth>
          <PencilLine size={18} /> {data.manageLabel}
        </Button>

        <p className="my-project__footer">{data.footer}</p>
      </PageShell>

      <BottomNav items={STUDENT_NAV_ITEMS} />
    </>
  );
}
