/**
 * PI² — Tela de Acesso (rota "/acesso").
 * -----------------------------------------------------------------------------
 * Tela intermediária entre a boas-vindas e o formulário de login, conforme o
 * protótipo: hero de acesso com logo, headline, prova social e os CTAs
 * "Entrar no PI²" (→ /login) e "Criar minha conta" (→ /cadastro).
 * Não exibe a vitrine — o foco é a entrada no sistema.
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import { fadeUpChild, staggerParent } from '../../styles/motion.js';
import styles from './AccessPage.module.css';

export default function AccessPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <motion.header
        className={styles.hero}
        variants={staggerParent}
        initial="hidden"
        animate="show"
      >
        <motion.div className={styles.logoCard} variants={fadeUpChild}>
          <Logo size={148} />
        </motion.div>

        <motion.p className={styles.eyebrow} variants={fadeUpChild}>
          Repositório acadêmico
        </motion.p>
        <motion.h1 className={styles.headline} variants={fadeUpChild}>
          Grandes ideias.
          <br />
          Conhecimento que se conecta.
        </motion.h1>
        <motion.p className={styles.lead} variants={fadeUpChild}>
          Projetos de todos os cursos em um só lugar. Compartilhe descobertas e
          construa o futuro da nossa faculdade.
        </motion.p>

        <motion.div className={styles.proof} variants={fadeUpChild}>
          <span className={styles.proofIcon}>
            <FiUsers aria-hidden="true" />
          </span>
          <div>
            <strong>Feito por alunos. Conectado a professores.</strong>
            <span>Da primeira ideia ao projeto publicado.</span>
          </div>
        </motion.div>

        <motion.div className={styles.actions} variants={fadeUpChild}>
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
        </motion.div>

        <motion.p className={styles.hint} variants={fadeUpChild}>
          Seu e-mail institucional é a porta de entrada.
        </motion.p>
      </motion.header>

      <footer className={styles.footer}>PI² · Ideias que multiplicam conhecimento</footer>
    </div>
  );
}
