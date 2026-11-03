import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader';
import TextField from '../../components/ui/TextField/TextField';
import AuthorRow from '../../components/ui/AuthorRow/AuthorRow';
import FileCard from '../../components/ui/FileCard/FileCard';
import CommentCard from '../../components/ui/CommentCard/CommentCard';
import { Bookmark, Send } from '../../components/icons';
import { projectService } from '../../services/projectService';
import './ProjectDetailsPage.css';

/**
 * Tela "Detalhes do projeto" (/projetos/:slug).
 * Os comentários enviados entram na lista apenas no estado local —
 * no semestre com back-end, o POST correspondente substituirá isso.
 */
export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const data = await projectService.getDetails(slug);
        if (active) {
          setPayload(data);
          setComments(data.project.comments);
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [slug]);

  function handleSubmit(event) {
    event.preventDefault();
    const text = comment.trim();
    if (!text) return;

    setComments((current) => [
      ...current,
      { id: `local-${Date.now()}`, author: 'Você', timeLabel: 'Agora', text },
    ]);
    setComment('');
  }

  if (loading) {
    return (
      <>
        <div className="project-details__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="project-details__status" role="status">
            Carregando projeto…
          </p>
        </PageShell>
      </>
    );
  }

  if (error || !payload) {
    return (
      <>
        <div className="project-details__topbar">
          <TopBar title="" />
        </div>

        <PageShell>
          <p className="project-details__status project-details__status--error" role="alert">
            {error || 'Não foi possível carregar o projeto.'}
          </p>
        </PageShell>
      </>
    );
  }

  const { header, project } = payload;

  return (
    <>
      <div className="project-details__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <img
          className="project-details__cover"
          src={project.cover.url}
          alt={project.cover.alt}
          width={366}
          height={212}
        />

        <div className="project-details__tags">
          <Badge tone="primary">{project.category}</Badge>
          <Badge tone="success">{project.status.label}</Badge>
        </div>

        <header className="project-details__header">
          <h1 className="project-details__title">{project.title}</h1>
          {project.meta.map((line) => (
            <p key={line} className="project-details__meta">
              {line}
            </p>
          ))}
        </header>

        <Button variant="secondary" fullWidth>
          <Bookmark size={18} /> {project.saveLabel}
        </Button>

        <section className="project-details__section">
          <h2 className="project-details__heading">Sobre o projeto</h2>
          <p className="project-details__description">{project.description}</p>
          <ul className="project-details__topics">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge tone="neutral">{tag}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="project-details__section">
          <h2 className="project-details__heading">Ideia construída por:</h2>
          <ul className="project-details__authors">
            {project.authors.map((author) => (
              <AuthorRow key={author.id} author={author} />
            ))}
          </ul>
        </section>

        <section className="project-details__section">
          <SectionHeader
            title="Arquivos do projeto"
            actionLabel={`${project.files.length} arquivos`}
          />
          <ul className="project-details__files">
            {project.files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        <section className="project-details__section">
          <SectionHeader
            title="Comentários"
            actionLabel={`${comments.length} comentários`}
          />
          <ul className="project-details__comments">
            {comments.map((item) => (
              <CommentCard key={item.id} comment={item} />
            ))}
          </ul>

          <form className="project-details__form" onSubmit={handleSubmit}>
            <TextField
              label={project.commentForm.label}
              placeholder={project.commentForm.placeholder}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button type="submit" fullWidth>
              <Send size={18} /> {project.commentForm.submitLabel}
            </Button>
          </form>
        </section>
      </PageShell>

    </>
  );
}
