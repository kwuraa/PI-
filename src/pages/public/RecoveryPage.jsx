/**
 * PI² — Recuperação de senha (rota "/recuperar-senha").
 * Envio simulado: após o envio, um callout de sucesso confirma que o link
 * foi enviado para o e-mail institucional (sem backend).
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiMail } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import styles from './RecoveryPage.module.css';

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/login')}
          aria-label="Voltar ao acesso"
        >
          <FiArrowLeft size={22} aria-hidden="true" />
        </button>
        <Logo size={40} />
      </div>

      <h1 className={styles.title}>Recuperar acesso</h1>
      <p className={styles.subtitle}>
        Informe seu e-mail institucional e enviaremos um link para você criar
        uma nova senha.
      </p>

      {sent ? (
        <Callout
          tone="success"
          icon={<FiCheckCircle size={22} aria-hidden="true" />}
          title="Link enviado!"
        >
          Se existir uma conta para <strong>{email}</strong>, o link de
          recuperação já está a caminho da sua caixa de entrada. O link expira em
          30 minutos.
        </Callout>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            label="E-mail institucional"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@aluno.faculdade.edu.br"
            icon={<FiMail size={18} aria-hidden="true" />}
          />
          <Button type="submit" size="lg" fullWidth>
            Enviar link de recuperação
          </Button>
        </form>
      )}

      <p className={styles.backLink}>
        Lembrou a senha? <Link to="/login">Voltar para o acesso</Link>
      </p>
    </div>
  );
}
