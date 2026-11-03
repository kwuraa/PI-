import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell/PageShell';
import LoggedHeader from '../../components/layout/LoggedHeader/LoggedHeader';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import TextField from '../../components/ui/TextField/TextField';
import Toggle from '../../components/ui/Toggle/Toggle';
import SettingsRow from '../../components/ui/SettingsRow/SettingsRow';
import { Lock, LogOut } from '../../components/icons';
import { profileService } from '../../services/profileService';
import './ProfilePage.css';

/**
 * Tela "Perfil e configurações".
 * Dados institucionais vêm do mock; preferências (campos, toggles e
 * "salvar") vivem em estado local até o back-end de perfil existir.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({});
  const [toggles, setToggles] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await profileService.get();
        if (active) {
          setProfile(data);
          setFormValues(
            Object.fromEntries(data.form.fields.map((f) => [f.id, f.value]))
          );
          setToggles(
            Object.fromEntries(
              data.notifications.options.map((o) => [o.id, o.enabled])
            )
          );
        }
      } catch (err) {
        if (active) setError(err.message ?? 'Erro ao carregar o perfil.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // No semestre com back-end: PATCH /api/profile com `formValues`.
    setSaved(true);
  }

  function handleFieldChange(id, value) {
    setFormValues((current) => ({ ...current, [id]: value }));
    setSaved(false);
  }

  if (loading) {
    return (
      <PageShell>
        <p className="profile__status" role="status">
          Carregando perfil…
        </p>
      </PageShell>
    );
  }

  if (error || !profile) {
    return (
      <PageShell>
        <p className="profile__status profile__status--error" role="alert">
          {error || 'Não foi possível carregar o perfil.'}
        </p>
      </PageShell>
    );
  }

  const { user, header, card, form, notifications, account, footer } = profile;

  return (
    <>
      <PageShell>
        <LoggedHeader context={header.context} user={user} />

        <section className="profile__intro">
          <h1 className="profile__title">{header.title}</h1>
          <p className="profile__subtitle">{header.subtitle}</p>
        </section>

        <section className="profile-card">
          <div className="profile-card__row">
            <span className="profile-card__avatar" aria-hidden="true">
              {card.initials}
            </span>
            <div className="profile-card__identity">
              <strong className="profile-card__name">{card.name}</strong>
              <Badge tone="primary">{card.badge}</Badge>
            </div>
          </div>
          <p className="profile-card__meta">{card.meta}</p>
        </section>

        <section className="profile__section">
          <h2 className="profile__heading">{form.title}</h2>

          <form className="profile__form" onSubmit={handleSubmit} noValidate>
            {form.fields.map((field) => (
              <div key={field.id} className="profile__field">
                <TextField
                  label={field.label}
                  value={formValues[field.id] ?? ''}
                  onChange={(event) =>
                    handleFieldChange(field.id, event.target.value)
                  }
                  disabled={field.locked}
                  icon={field.locked ? <Lock size={18} /> : undefined}
                />
                {field.help && <p className="profile__help">{field.help}</p>}
              </div>
            ))}

            <Button type="submit" fullWidth>
              {form.submitLabel}
            </Button>

            {saved && (
              <p className="profile__saved" role="status">
                {form.savedFeedback}
              </p>
            )}
          </form>
        </section>

        <section className="profile__section">
          <h2 className="profile__heading">{notifications.title}</h2>
          <div className="profile__card">
            {notifications.options.map((option) => (
              <div key={option.id} className="profile-option">
                <span className="profile-option__text">
                  <strong className="profile-option__label">
                    {option.label}
                  </strong>
                  <span className="profile-option__description">
                    {option.description}
                  </span>
                </span>
                <Toggle
                  checked={toggles[option.id]}
                  label={option.label}
                  onChange={(next) =>
                    setToggles((current) => ({ ...current, [option.id]: next }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="profile__section">
          <h2 className="profile__heading">{account.title}</h2>
          <ul className="profile__card profile__card--list">
            {account.links.map((link) => (
              <SettingsRow
                key={link.id}
                icon={link.icon}
                label={link.label}
                href={link.href}
              />
            ))}
          </ul>
        </section>

        <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
          <LogOut size={18} /> {account.logoutLabel}
        </Button>

        <p className="profile__footer">{footer}</p>
      </PageShell>

    </>
  );
}
