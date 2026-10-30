import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import FileCard from '../../components/ui/FileCard/FileCard';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import {
  Bookmark,
  Eye,
  FileText,
  Maximize2,
  BookOpen,
  ExternalLink,
} from '../../components/icons';
import { projectService } from '../../services/projectService';
import './PublicProjectPage.css';

/**
 * Tela "Leitura pública do projeto" (/projetos/:slug/publico).
 * Visualização somente-leitura para a comunidade: prévia do relatório
 * e links públicos (sem materiais internos da equipe).
 */
export default function PublicProjectPage() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await projectService.getPublic(slug);
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
        <p className="public__status" role="status">
          Carregando projeto…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="public__status public__status--error" role="alert">
          {error || 'Não foi possível carregar o projeto.'}
        </p>
      </PageShell>
    );
  }

  const { header, project, about, document: doc, external } = data;
  const preview = doc.preview;

  return (
    <>
      <div className="public__topbar">
        <TopBar
          title={header.title}
          action={
            <button
              type="button"
              className="public__bookmark"
              aria-label="Salvar projeto"
            >
              <Bookmark size={20} />
            </button>
          }
        />
      </div>

      <PageShell>
        <section className="public__header">
          <Badge tone="neutral">{header.modeBadge}</Badge>
          <span className="public__read-only">
            <Eye size={16} aria-hidden="true" /> {header.readOnlyLabel}
          </span>
        </section>

        {project.heroImage && (
          <img className="public__hero-image" src={project.heroImage} alt="" />
        )}

        <section className="public__project">
          <div className="public__badges">
            <Badge>{project.courseBadge}</Badge>
            <Badge tone={project.statusBadge.tone}>
              {project.statusBadge.label}
            </Badge>
          </div>

          <h1 className="public__title">{project.title}</h1>
          <p className="public__meta">{project.meta}</p>
          <p className="public__meta">{project.publishedLine}</p>
          <strong className="public__authors">{project.authors}</strong>
          <p className="public__advisor">{project.advisor}</p>
        </section>

        <section className="public__section">
          <h2 className="public__heading">{about.title}</h2>
          <p className="public__text">{about.description}</p>
          <ul className="public__tags">
            {about.tags.map((tag) => (
              <li className="public__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section className="public__section">
          <SectionHeader title={doc.title} actionLabel={doc.actionLabel} />

          <ul className="public__files">
            <FileCard file={doc.file} actionIcon="view" />
          </ul>

          {/* Prévia do relatório em formato de página */}
          <article className="public__preview">
            <header className="public__preview-header">
              <span className="public__preview-icon" aria-hidden="true">
                <FileText size={20} />
              </span>
              <strong className="public__preview-title">{preview.title}</strong>
              <button
                type="button"
                className="public__preview-expand"
                aria-label="Ampliar prévia"
              >
                <Maximize2 size={18} />
              </button>
            </header>

            <div className="public__sheet">
              <span className="public__sheet-kicker">{preview.kicker}</span>
              <span className="public__sheet-rule" aria-hidden="true" />
              <strong className="public__sheet-heading">{preview.heading}</strong>
              <span className="public__sheet-subheading">
                {preview.subheading}
              </span>
              <p className="public__sheet-line">{preview.authors}</p>
              <p className="public__sheet-line">{preview.course}</p>
              <strong className="public__sheet-summary">
                {preview.summaryLabel}
              </strong>
              {preview.paragraphs.map((paragraph) => (
                <p className="public__sheet-paragraph" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              <p className="public__sheet-line">{preview.advisor}</p>
            </div>
          </article>

          <Button variant="secondary" fullWidth>
            <BookOpen size={18} /> {doc.readFullLabel}
          </Button>
        </section>

        <section className="public__external">
          <header className="public__external-header">
            <span className="public__external-icon" aria-hidden="true">
              <ExternalLink size={20} />
            </span>
            <span className="public__external-text">
              <strong className="public__external-title">{external.title}</strong>
              <span className="public__external-description">
                {external.description}
              </span>
            </span>
          </header>
          <p className="public__external-url">{external.url}</p>
          <Button fullWidth>
            <ExternalLink size={18} /> {external.actionLabel}
          </Button>
        </section>

        <p className="public__footer">{data.footer}</p>
      </PageShell>

    </>
  );
}
