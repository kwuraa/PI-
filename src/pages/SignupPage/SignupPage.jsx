import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import Button from '../../components/ui/Button/Button';
import TextField from '../../components/ui/TextField/TextField';
import Select from '../../components/ui/Select/Select';
import ChoiceCard from '../../components/ui/ChoiceCard/ChoiceCard';
import { authService } from '../../services/authService';
import {
  ArrowRight,
  Mail,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  Monitor,
  User,
} from '../../components/icons';
import './SignupPage.css';

const ACCESS_MODES = [
  { id: 'student', label: 'Aluno', icon: <GraduationCap size={22} /> },
  { id: 'professor', label: 'Professor', icon: <Monitor size={22} /> },
];

/* Listas estáticas de exemplo — virão de GET /api/courses e GET /api/periods */
const COURSES = [
  'Sistemas de Informação',
  'Arquitetura e Urbanismo',
  'Engenharia Ambiental',
  'Administração',
  'Gestão Empresarial',
];
const PERIODS = ['1º período', '2º período', '3º período', '4º período', '5º período', '6º período'];

/**
 * Tela "Cadastro institucional" (/cadastro).
 * Cria a conta de aluno ou professor; após o envio o usuário
 * confirma o vínculo pelo e-mail institucional.
 */
export default function SignupPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('student');
  const [name, setName] = useState('Ana Costa');
  const [email, setEmail] = useState('ana.costa@aluno.faculdade.edu.br');
  const [registration, setRegistration] = useState('202610248');
  const [course, setCourse] = useState(COURSES[0]);
  const [period, setPeriod] = useState(PERIODS[3]);
  const [password, setPassword] = useState('************');
  const [confirm, setConfirm] = useState('************');
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modeLabel =
    ACCESS_MODES.find((item) => item.id === mode)?.label.toLowerCase() ?? '';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setTermsError('');

    // Validações didáticas — a API real também validará no servidor
    const hasLetter = /[a-zA-ZÀ-ÿ]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 8 || !hasLetter || !hasNumber) {
      setError('Use pelo menos 8 caracteres, com letras e números.');
      return;
    }

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!terms) {
      setTermsError('Aceite os termos para criar a conta.');
      return;
    }

    setSubmitting(true);

    try {
      await authService.register({
        name,
        email,
        registration,
        course,
        period,
        role: mode,
        password,
      });
      // Após o cadastro, o vínculo é confirmado pelo e-mail institucional
      navigate('/acessar');
    } catch (err) {
      setError(err.message ?? 'Não foi possível criar a conta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="signup">
      <TopBar title="Criar minha conta" onBack={() => navigate('/acessar')} />

      <main className="signup__content">
        <h1 className="signup__title">Suas ideias começam aqui.</h1>
        <p className="signup__subtitle">
          Faça parte do PI² com sua conta institucional. Os campos com *
          são obrigatórios.
        </p>

        <form className="signup__form" onSubmit={handleSubmit} noValidate>
          <fieldset className="signup__modes">
            <legend className="signup__legend">
              Como você participa da faculdade?
            </legend>

            <div className="signup__modes-grid" role="radiogroup">
              {ACCESS_MODES.map((item) => (
                <ChoiceCard
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  selected={mode === item.id}
                  onSelect={() => setMode(item.id)}
                />
              ))}
            </div>
          </fieldset>

          <h2 className="signup__section-title">Seus dados</h2>

          <TextField
            label="Nome completo *"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            icon={<User size={20} />}
          />

          <TextField
            label="E-mail institucional *"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail size={20} />}
            helper="Use o e-mail fornecido pela sua faculdade."
          />

          <TextField
            label="Matrícula *"
            name="registration"
            inputMode="numeric"
            value={registration}
            onChange={(event) => setRegistration(event.target.value)}
          />

          <Select
            label="Curso *"
            options={COURSES}
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          />

          <Select
            label="Período *"
            options={PERIODS}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          />

          <h2 className="signup__section-title">Crie sua senha</h2>

          <TextField
            label="Senha *"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={<EyeOff size={20} />}
            helper="Use pelo menos 8 caracteres, letras e números."
            error={error}
          />

          <TextField
            label="Confirmar senha *"
            type="password"
            name="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            icon={<EyeOff size={20} />}
          />

          <div className="signup__terms">
            <label className="signup__terms-label">
              <input
                type="checkbox"
                className="signup__checkbox"
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
              />
              Li e aceito os Termos de uso e a Política de privacidade do PI².
            </label>
            {termsError && (
              <p className="signup__terms-error" role="alert">
                {termsError}
              </p>
            )}
          </div>

          <Button type="submit" fullWidth disabled={submitting}>
            <ArrowRight size={20} />
            {submitting ? 'Criando conta…' : `Criar conta de ${modeLabel}`}
          </Button>

          <aside className="signup__info">
            <span className="signup__info-icon" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
            <div className="signup__info-text">
              <strong>Confirme seu vínculo institucional</strong>
              <span>
                Após o cadastro, enviaremos as instruções de confirmação para
                seu e-mail institucional.
              </span>
            </div>
          </aside>
        </form>

        <p className="signup__login">
          Já tenho conta ·{' '}
          <button
            type="button"
            className="signup__link"
            onClick={() => navigate('/acessar')}
          >
            Entrar
          </button>
        </p>
      </main>
    </div>
  );
}
