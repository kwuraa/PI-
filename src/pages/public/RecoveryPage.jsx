import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiKey,
  FiMail,
  FiMoreHorizontal,
  FiAlertCircle,
} from 'react-icons/fi';

import Button from '../../components/ui/Button/Button.jsx';
import Callout from '../../components/ui/Callout/Callout.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import styles from './RecoveryPage.module.css';

/** Passos do card "Como funciona". */
const STEPS = [
  {
    title: 'Confira sua caixa de entrada',
    text: 'Se o e-mail estiver cadastrado, enviaremos uma mensagem de recuperação.',
  },
  {
    title: 'Crie uma nova senha',
    text: 'Abra a mensagem e siga as instruções para redefinir sua senha.',
  },
  {
    title: 'Volte ao PI²',
    text: 'Entre novamente com a nova senha.',
  },
];

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
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/login')}
          aria-label="Voltar ao acesso"
        >
          <FiArrowLeft size={20} aria-hidden="true" />
        </button>
        <span className={styles.topTitle}>Recuperar acesso</span>
        <button
          type="button"
          className={styles.more}
          aria-label="Mais opções"
          disabled
        >
          <FiMoreHorizontal size={20} aria-hidden="true" />
        </button>
      </header>

      <div className={styles.keyTile}>
        <FiKey size={26} aria-hidden="true" />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Vamos recuperar seu acesso.</h1>
        <p className={styles.subtitle}>
          Informe o e-mail institucional da sua conta. Você receberá as
          instruções para criar uma nova senha.
        </p>
      </header>

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
            placeholder="ana.costa@aluno.faculdade.edu.br"
            icon={<FiMail size={18} aria-hidden="true" />}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            icon={<FiMail aria-hidden="true" />}
          >
            Enviar instruções
          </Button>
        </form>
      )}

      <section className={styles.howto} aria-labelledby="como-funciona-title">
        <h2 className={styles.howtoTitle} id="como-funciona-title">
          Como funciona
        </h2>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNum} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside className={styles.spam}>
        <FiAlertCircle aria-hidden="true" />
        <div>
          <strong>Não encontrou a mensagem?</strong>
          <p>
            Confira a pasta de spam. Se não tiver acesso ao e-mail
            institucional, procure o suporte da sua faculdade.
          </p>
        </div>
      </aside>

      <Button
        variant="secondary"
        fullWidth
        onClick={() => navigate('/login')}
      >
        Voltar para o acesso
      </Button>
    </div>
  );
}
