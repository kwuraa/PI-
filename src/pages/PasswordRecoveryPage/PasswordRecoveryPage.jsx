import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import Button from '../../components/ui/Button/Button';
import TextField from '../../components/ui/TextField/TextField';
import { authService } from '../../services/authService';
import { Key, Mail, Info } from '../../components/icons';
import './PasswordRecoveryPage.css';

/* Passos explicativos — texto fixo da tela */
const STEPS = [
  {
    id: 1,
    title: 'Confira sua caixa de entrada',
    description:
      'Se o e-mail estiver cadastrado, enviaremos uma mensagem de recuperação.',
  },
  {
    id: 2,
    title: 'Crie uma nova senha',
    description:
      'Abra a mensagem e siga as instruções para redefinir sua senha.',
  },
  {
    id: 3,
    title: 'Volte ao PI²',
    description: 'Entre novamente com a nova senha.',
  },
];

/**
 * Tela "Recuperação de senha" (/recuperar).
 * Envia instruções de redefinição para o e-mail institucional.
 */
export default function PasswordRecoveryPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('ana.costa@aluno.faculdade.edu.br');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setFeedback('');
    setSubmitting(true);

    try {
      const data = await authService.recover({ email });
      setFeedback(data.message);
    } catch (err) {
      setError(err.message ?? 'Não foi possível enviar as instruções.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="recovery">
      <TopBar title="Recuperar acesso" onBack={() => navigate('/acessar')} />

      <main className="recovery__content">
        <span className="recovery__icon" aria-hidden="true">
          <Key size={26} />
        </span>

        <h1 className="recovery__title">Vamos recuperar seu acesso.</h1>
        <p className="recovery__description">
          Informe o e-mail institucional da sua conta. Você receberá as
          instruções para criar uma nova senha.
        </p>

        <form className="recovery__form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="E-mail institucional"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail size={20} />}
            error={error}
          />

          <Button type="submit" fullWidth disabled={submitting}>
            <Mail size={18} />
            {submitting ? 'Enviando…' : 'Enviar instruções'}
          </Button>

          {feedback && (
            <p className="recovery__feedback" role="status">
              {feedback}
            </p>
          )}
        </form>

        <section className="recovery__card">
          <h2 className="recovery__card-title">Como funciona</h2>

          <ol className="recovery__steps">
            {STEPS.map((step) => (
              <li className="recovery__step" key={step.id}>
                <span className="recovery__step-number" aria-hidden="true">
                  {step.id}
                </span>
                <span className="recovery__step-body">
                  <strong className="recovery__step-title">{step.title}</strong>
                  <span className="recovery__step-description">
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="recovery__alert">
          <span className="recovery__alert-icon" aria-hidden="true">
            <Info size={20} />
          </span>
          <div className="recovery__alert-text">
            <strong>Não encontrou a mensagem?</strong>
            <span>
              Confira a pasta de spam. Se não tiver acesso ao e-mail
              institucional, procure o suporte da sua faculdade.
            </span>
          </div>
        </aside>

        <Button variant="secondary" fullWidth onClick={() => navigate('/acessar')}>
          Voltar para o acesso
        </Button>
      </main>
    </div>
  );
}
