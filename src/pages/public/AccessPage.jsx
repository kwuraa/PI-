/**
 * PI² — Tela de Acesso (rota "/acesso").
 * -----------------------------------------------------------------------------
 * Tela intermediária entre a boas-vindas e o formulário de login, conforme o
 * protótipo: hero de acesso com logo, headline, prova social e os CTAs
 * "Entrar no PI²" (→ /login) e "Criar minha conta" (→ /cadastro).
 * Não exibe a vitrine — o foco é a entrada no sistema.
 */
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './AccessPage.module.css';

export default function AccessPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.logoCard}>
          <Logo size={148} />
        </div>

        <p className={styles.eyebrow}>Repositório acadêmico</p>
        <h1 className={styles.headline}>
          Grandes ideias.
          <br />
          Conhecimento que se conecta.
        </h1>
        <p className={styles.lead}>
          Projetos de todos os cursos em um só lugar. Compartilhe descobertas e
          construa o futuro da nossa faculdade.
        </p>

        <div className={styles.proof}>
          <span className={styles.proofIcon}>
            <FiUsers aria-hidden="true" />
          </span>
          <div>
            <strong>Feito por alunos. Conectado a professores.</strong>
            <span>Da primeira ideia ao projeto publicado.</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            fullWidth
            size="lg"
            iconAfter={<FiArrowRight aria-hidden="true" />}
            onClick={() => navigate('/login')}
          >
            Entrar no PI²
          </Button>
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/cadastro')}>
            Criar minha conta
          </Button>
        </div>

        <p className={styles.hint}>Seu e-mail institucional é a porta de entrada.</p>
      </header>

      <footer className={styles.footer}>PI² · Ideias que multiplicam conhecimento</footer>
    </div>
  );
}
