import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import PageShell from '../../components/layout/PageShell/PageShell';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import AlertCard from '../../components/ui/AlertCard/AlertCard';
import Select from '../../components/ui/Select/Select';
import TextField from '../../components/ui/TextField/TextField';
import TextAreaField from '../../components/ui/TextAreaField/TextAreaField';
import { ArrowLeft, Lock, PencilLine, Check, Plus } from '../../components/icons';
import { criteriaService } from '../../services/criteriaService';
import { PROFESSOR_NAV_ITEMS } from '../../config/navigation';
import './ProfessorCriteriaPage.css';

const requiredLabel = (field) => (field.required ? `${field.label} *` : field.label);

/**
 * Tela "Meus critérios" (/professor/criterios).
 * Os critérios gerais são somente leitura (definidos pela coordenação);
 * o professor cria critérios específicos da disciplina.
 */
export default function ProfessorCriteriaPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specificItems, setSpecificItems] = useState([]);
  const [formOpen, setFormOpen] = useState(true);
  const [values, setValues] = useState({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await criteriaService.getForProfessor();
        if (active) {
          setData(response);
          setSpecificItems(response.specific.items);
          setValues({
            name: response.form.fields.name.value,
            weight: response.form.fields.weight.value,
            description: response.form.fields.description.value,
          });
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar os critérios.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setFeedback('');
  }

  function handleSave() {
    setSpecificItems((current) => [
      ...current,
      {
        id: `crit-${current.length + 1}`,
        name: values.name,
        weight: `Peso ${values.weight}`,
        description: values.description,
      },
    ]);
    setValues({ name: '', weight: '', description: '' });
    setFeedback(data.form.savedFeedback);
  }

  function handleOpenForm() {
    setFormOpen(true);
    setFeedback('');
    document
      .getElementById('novo-criterio')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) {
    return (
      <PageShell>
        <p className="prof-criteria__status" role="status">
          Carregando critérios…
        </p>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell>
        <p className="prof-criteria__status prof-criteria__status--error" role="alert">
          {error || 'Não foi possível carregar os critérios.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, lockedNotice, general, specific, form } = data;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <Link to={header.backHref} className="prof-criteria__back">
          <ArrowLeft size={16} /> {header.backLabel}
        </Link>

        <section className="prof-criteria__intro">
          <h1 className="prof-criteria__title">{header.title}</h1>
          <p className="prof-criteria__description">{header.description}</p>
        </section>

        <AlertCard
          icon={lockedNotice.icon}
          tone={lockedNotice.tone}
          title={lockedNotice.title}
          description={lockedNotice.description}
        />

        <section className="prof-criteria__section">
          <div className="prof-criteria__section-header">
            <h2 className="prof-criteria__heading">{general.title}</h2>
            <span className="prof-criteria__total">{general.totalLabel}</span>
          </div>

          {general.items.map((item) => (
            <article className="prof-criteria__card" key={item.id}>
              <header className="prof-criteria__card-header">
                <span className="prof-criteria__lock" aria-hidden="true">
                  <Lock size={18} />
                </span>
                <strong className="prof-criteria__card-title">{item.name}</strong>
                <Badge tone="neutral">{item.weight}</Badge>
              </header>
              <p className="prof-criteria__card-text">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="prof-criteria__section">
          <h2 className="prof-criteria__heading">{specific.title}</h2>

          <Select
            label={specific.discipline.label}
            options={specific.discipline.options}
            defaultValue={specific.discipline.value}
          />

          <p className="prof-criteria__helper">{specific.helper}</p>

          {specificItems.map((item) => (
            <article className="prof-criteria__card" key={item.id}>
              <header className="prof-criteria__card-header">
                <strong className="prof-criteria__card-title">{item.name}</strong>
                <Link
                  to={`/professor/criterios/${item.id}`}
                  className="prof-criteria__edit"
                  aria-label={`Editar ${item.name}`}
                >
                  <PencilLine size={18} />
                </Link>
              </header>
              <div>
                <Badge tone="neutral">{item.weight}</Badge>
              </div>
              <p className="prof-criteria__card-text">{item.description}</p>
            </article>
          ))}

          <Button variant="secondary" fullWidth onClick={handleOpenForm}>
            <Plus size={18} /> {specific.addLabel}
          </Button>
        </section>

        {formOpen && (
          <section className="prof-criteria__section" id="novo-criterio">
            <h2 className="prof-criteria__heading">{form.title}</h2>

            <div className="prof-criteria__form-card">
              <div>
                <Badge tone="neutral">{form.draftBadge}</Badge>
              </div>

              <TextField
                label={requiredLabel(form.fields.name)}
                value={values.name}
                onChange={(event) => handleChange('name', event.target.value)}
              />

              <TextField
                label={requiredLabel(form.fields.weight)}
                value={values.weight}
                onChange={(event) => handleChange('weight', event.target.value)}
              />

              <TextAreaField
                label={requiredLabel(form.fields.description)}
                value={values.description}
                onChange={(event) =>
                  handleChange('description', event.target.value)
                }
                helper={form.helper}
              />
            </div>

            <div className="prof-criteria__actions">
              <Button fullWidth onClick={handleSave}>
                <Check size={18} /> {form.saveLabel}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setFormOpen(false)}
              >
                {form.cancelLabel}
              </Button>
            </div>

            {feedback && (
              <p className="prof-criteria__feedback" role="status">
                {feedback}
              </p>
            )}
          </section>
        )}
      </PageShell>

      <BottomNav items={PROFESSOR_NAV_ITEMS} />
    </>
  );
}
