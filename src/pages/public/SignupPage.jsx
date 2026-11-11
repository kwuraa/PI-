/**
 * PI² — Cadastro institucional (rota "/cadastro").
 * -----------------------------------------------------------------------------
 * O curso fica TRAVADO em "DSM · Desenvolvimento de Software" (briefing:
 * cadastro restrito ao DSM). Após criar a conta, o usuário é levado ao
 * login para escolher o perfil de acesso.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE } from '../../mocks/projectsMock.js';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Protótipo: não há backend — só leva ao login.
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/')}
          aria-label="Voltar para a boas-vindas"
        >
          <FiArrowLeft size={22} aria-hidden="true" />
        </button>
        <Logo size={40} />
      </div>

      <h1 className={styles.title}>Criar conta institucional</h1>
      <p className={styles.subtitle}>
        Seu acesso ao PI² é vinculado ao seu perfil na faculdade. Preencha os
        dados abaixo para começar.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField label="Nome completo" required autoComplete="name" placeholder="Seu nome" />
        <TextField
          label="E-mail institucional"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@aluno.faculdade.edu.br"
          hint="Use o e-mail emitido pela instituição."
        />

        {/* Curso travado no DSM — não pode ser alterado no cadastro. */}
        <TextField label="Curso" value={COURSE} locked readOnly />

        <Select label="Perfil de acesso" required defaultValue="aluno">
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="coordenador">Coordenador</option>
          <option value="secretaria">Secretaria</option>
        </Select>

        <TextField
          label="Senha"
          type="password"
          required
          autoComplete="new-password"
          hint="Mínimo de 8 caracteres (demonstração)."
        />

        <label className={styles.agree}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span>
            Autorizo o uso dos meus dados no PI² conforme a política de
            privacidade e os termos de uso (LGPD).
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!agreed}
          iconAfter={<FiArrowRight aria-hidden="true" />}
        >
          Criar conta
        </Button>
      </form>

      <p className={styles.login}>
        Já tem conta? <Link to="/login">Entrar no PI²</Link>
      </p>
    </div>
  );
}
