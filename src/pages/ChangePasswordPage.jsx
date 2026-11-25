/**
 * PI² — Alterar senha (rota "/alterar-senha").
 * -----------------------------------------------------------------------------
 * Tela de conta acessada pelo card "Conta e privacidade" do perfil
 * (ListRow "Alterar senha"). Segue o padrão das páginas logadas:
 * badge + h1 + subtítulo no topo, card com o formulário (senha atual,
 * nova senha e confirmação), dicas de segurança e callout de sucesso
 * após a troca — tudo simulado, sem backend.
 * A recuperação de senha (quem esqueceu a atual) continua em
 * "/recuperar-senha", linkado abaixo do formulário.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiKey } from 'react-icons/fi';

import Button from '../components/ui/Button/Button.jsx';
import Callout from '../components/ui/Callout/Callout.jsx';
import Card from '../components/ui/Card/Card.jsx';
import PageHeader from '../components/ui/PageHeader/PageHeader.jsx';
import TextField from '../components/ui/TextField/TextField.jsx';
import styles from './ChangePasswordPage.module.css';

/** Requisitos exibidos ao lado do formulário (mock). */
const REQUIREMENTS = [
  'Mínimo de 8 caracteres',
  'Pelo menos uma letra e um número',
  'Diferente da senha atual',
];

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (next.length < 8) {
      setError('A nova senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    if (next !== confirm) {
      setError('A confirmação não coincide com a nova senha.');
      return;
    }
    if (next === current) {
      setError('A nova senha precisa ser diferente da atual.');
      return;
    }

    setError(null);
    setSaved(true);
  };

  /** Volta ao formulário para uma nova troca. */
  const handleReset = () => {
    setSaved(false);
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  return (
    <div className={styles.page}>
      {/* -------------------------------------------------- cabeçalho */}
      <PageHeader
        eyebrow="Conta e segurança"
        caps
        gap="sm"
        titleLine="normal"
        title="Alterar sua senha"
        lead="Mantenha sua conta protegida com uma senha que só você conhece."
      />

      {saved ? (
        /* -------------------------------------- sucesso (simulado) */
        <div className={styles.successBlock}>
          <Callout
            tone="success"
            icon={<FiCheckCircle size={22} aria-hidden="true" />}
            title="Senha alterada!"
          >
            Sua nova senha já está ativa. Use-a no próximo acesso ao PI².
          </Callout>
          <Button variant="secondary" fullWidth onClick={handleReset}>
            Alterar novamente
          </Button>
          <Link to="/perfil" className={styles.backLink}>
            Voltar para o perfil
          </Link>
        </div>
      ) : (
        <Card padding="lg" className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fields}>
              <TextField
                label="Senha atual"
                type="password"
                required
                autoComplete="current-password"
                value={current}
                onChange={(e) => {
                  setCurrent(e.target.value);
                  setError(null);
                }}
                icon={<FiKey size={18} aria-hidden="true" />}
              />
              <TextField
                label="Nova senha"
                type="password"
                required
                autoComplete="new-password"
                value={next}
                onChange={(e) => {
                  setNext(e.target.value);
                  setError(null);
                }}
                icon={<FiKey size={18} aria-hidden="true" />}
              />
              <TextField
                label="Confirmar nova senha"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError(null);
                }}
                icon={<FiKey size={18} aria-hidden="true" />}
              />
            </div>

            {error && (
              <Callout
                tone="danger"
                icon={<FiAlertCircle size={22} aria-hidden="true" />}
                title="Não foi possível alterar"
              >
                {error}
              </Callout>
            )}

            <ul className={styles.requirements}>
              {REQUIREMENTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Button type="submit" size="lg" fullWidth>
              Salvar nova senha
            </Button>
          </form>

          <p className={styles.forgot}>
            Esqueceu a senha atual?{' '}
            <Link to="/recuperar-senha">Recuperar acesso</Link>
          </p>
        </Card>
      )}
    </div>
  );
}
