import React, { useEffect, useState } from 'react';
import TopBar from '../../components/layout/TopBar/TopBar';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import TextField from '../../components/ui/TextField/TextField';
import TextAreaField from '../../components/ui/TextAreaField/TextAreaField';
import Select from '../../components/ui/Select/Select';
import RadioOption from '../../components/ui/RadioOption/RadioOption';
import UploadBox from '../../components/ui/UploadBox/UploadBox';
import FileCard from '../../components/ui/FileCard/FileCard';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import { Users, Plus, Send } from '../../components/icons';
import { studentService } from '../../services/studentService';
import { STUDENT_NAV_ITEMS } from '../../config/navigation';
import './PublishProjectPage.css';

/** Monta o label com "*" quando o campo é obrigatório. */
const requiredLabel = (field) => (field.required ? `${field.label} *` : field.label);

/**
 * Tela "Novo projeto" (/meus-projetos/novo).
 * Rascunho, envio e uploads vivem em estado local — no back-end
 * futuro, POST /api/student/projects fará o envio ao orientador.
 */
export default function PublishProjectPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [values, setValues] = useState({});
  const [visibility, setVisibility] = useState('public');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;

    async function loadForm() {
      try {
        const data = await studentService.getNewProjectForm();
        if (active) {
          setForm(data);
          setVisibility(data.visibility.selected);
          setValues({
            title: data.about.fields.title.value,
            course: data.about.fields.course.value,
            type: data.about.fields.type.value,
            description: data.about.fields.description.value,
            members: data.team.members.value,
            advisor: data.team.advisor.value,
          });
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o formulário.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadForm();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setFeedback('');
  }

  if (loading) {
    return (
      <PageShell>
        <p className="publish__status" role="status">
          Carregando formulário…
        </p>
      </PageShell>
    );
  }

  if (error || !form) {
    return (
      <PageShell>
        <p className="publish__status publish__status--error" role="alert">
          {error || 'Não foi possível carregar o formulário.'}
        </p>
      </PageShell>
    );
  }

  const { header, about, team, files, visibility: vis, alert } = form;
  const descriptionField = about.fields.description;

  return (
    <>
      <div className="publish__topbar">
        <TopBar title={header.title} />
      </div>

      <PageShell>
        <section className="publish__intro">
          <h1 className="publish__headline">{header.headline}</h1>
          <p className="publish__description">{header.description}</p>
          <Badge tone="neutral">{header.draftLabel}</Badge>
        </section>

        <section className="publish__section">
          <h2 className="publish__heading">{about.title}</h2>

          <TextField
            label={requiredLabel(about.fields.title)}
            value={values.title}
            onChange={(event) => handleChange('title', event.target.value)}
          />

          <Select
            label={requiredLabel(about.fields.course)}
            options={about.fields.course.options}
            value={values.course}
            onChange={(event) => handleChange('course', event.target.value)}
          />

          <Select
            label={requiredLabel(about.fields.type)}
            options={about.fields.type.options}
            value={values.type}
            onChange={(event) => handleChange('type', event.target.value)}
          />

          <TextAreaField
            label={requiredLabel(descriptionField)}
            value={values.description}
            maxLength={descriptionField.maxLength}
            onChange={(event) => handleChange('description', event.target.value)}
            helper={`${values.description.length} / ${descriptionField.maxLength.toLocaleString('pt-BR')} caracteres`}
          />
        </section>

        <section className="publish__section">
          <h2 className="publish__heading">{team.title}</h2>

          <TextField
            label={requiredLabel(team.members)}
            value={values.members}
            onChange={(event) => handleChange('members', event.target.value)}
            icon={<Users size={20} />}
          />
          <p className="publish__help">{team.members.help}</p>

          <button type="button" className="publish__add">
            <Plus size={18} /> {team.addMemberLabel}
          </button>

          <Select
            label={requiredLabel(team.advisor)}
            options={team.advisor.options}
            value={values.advisor}
            onChange={(event) => handleChange('advisor', event.target.value)}
          />
        </section>

        <section className="publish__section">
          <h2 className="publish__heading">{files.title}</h2>

          <UploadBox
            title={files.upload.title}
            hint={files.upload.hint}
            onClick={() => setFeedback('Upload simulado — no back-end, o arquivo será enviado ao servidor.')}
          />

          <ul className="publish__files">
            {files.items.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </ul>
        </section>

        <section className="publish__section">
          <h2 className="publish__heading">{vis.title}</h2>
          <ul className="publish__visibility">
            {vis.options.map((option) => (
              <RadioOption
                key={option.id}
                label={option.label}
                description={option.description}
                checked={visibility === option.id}
                onChange={() => {
                  setVisibility(option.id);
                  setFeedback('');
                }}
              />
            ))}
          </ul>
        </section>

        <AlertCard
          icon={alert.icon}
          title={alert.title}
          description={alert.description}
        />

        <div className="publish__actions">
          <Button
            fullWidth
            onClick={() => setFeedback(form.sentFeedback)}
          >
            <Send size={18} /> {form.submitLabel}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setFeedback(form.draftFeedback)}
          >
            {form.draftActionLabel}
          </Button>
        </div>

        {feedback && (
          <p className="publish__feedback" role="status">
            {feedback}
          </p>
        )}
      </PageShell>

      <BottomNav items={STUDENT_NAV_ITEMS} />
    </>
  );
}
