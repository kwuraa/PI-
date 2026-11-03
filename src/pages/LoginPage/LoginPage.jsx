import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import Button from '../../components/ui/Button/Button';
import TextField from '../../components/ui/TextField/TextField';
import ChoiceCard from '../../components/ui/ChoiceCard/ChoiceCard';
import { authService } from '../../services/authService';
import {
  ArrowRight,
  Mail,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  Monitor,
} from '../../components/icons';
import './LoginPage.css';

const ACCESS_MODES = [
  { id: 'student', label: 'Aluno', icon: <GraduationCap size={22} /> },
  { id: 'professor', label: 'Professor', icon: <Monitor size={22} /> },
];

/**
 * Tela "Acessar o PI²".
 * A lógica de autenticação vive aqui; os dados vêm de
 * authService (mock hoje, API real amanhã — sem refatoração).
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('student');
  const [email, setEmail] = useState('ana.costa@aluno.faculdade.edu.br');
  const [password, setPassword] = useState('************');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modeLabel =
    ACCESS_MODES.find((item) => item.id === mode)?.label.toLowerCase() ?? '';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await authService.login({ email, password });
      // Roteamento por perfil: aluno vai para a sua área,
      // professor/coordenador vai para o painel unificado.
      navigate(mode === 'student' ? '/meus-projetos' : '/painel');
    } catch (err) {
      setError(err.message ?? 'Não foi possível entrar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login">
      <TopBar title="Acessar o PI²" onBack={() => navigate('/')} />

      <main className="login__content">
        <h1 className="login__title">Bom ter você aqui.</h1>
        <p className="login__subtitle">
          Entre com sua conta institucional para continuar suas ideias.
        </p>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <fieldset className="login__modes">
            <legend className="login__legend">Como você acessa o PI²?</legend>

            <div className="login__modes-grid" role="radiogroup">
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

          <TextField
            label="E-mail institucional"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seu.nome@faculdade.edu.br"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail size={20} />}
          />

          <TextField
            label="Senha"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={<EyeOff size={20} />}
            error={error}
          />

          <div className="login__options">
            <label className="login__remember">
              <input
                type="checkbox"
                className="login__checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Lembrar de mim
            </label>

            <button
              type="button"
              className="login__link"
              onClick={() => navigate('/recuperar')}
            >
              Esqueci minha senha
            </button>
          </div>

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting
              ? 'Entrando…'
              : `Entrar como ${modeLabel}`}{' '}
            <ArrowRight size={20} />
          </Button>

          <aside className="login__info">
            <span className="login__info-icon" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
            <div className="login__info-text">
              <strong>Um espaço para toda a faculdade</strong>
              <span>
                Alunos publicam e descobrem projetos. Professores orientam,
                revisam e aprovam.
              </span>
            </div>
          </aside>
        </form>

        <p className="login__signup">
          Ainda não tem conta?{' '}
          <button
            type="button"
            className="login__link"
            onClick={() => navigate('/cadastro')}
          >
            Criar conta
          </button>
        </p>
      </main>
    </div>
  );
}
