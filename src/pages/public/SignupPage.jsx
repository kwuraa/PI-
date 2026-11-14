/**
 * PI² — Cadastro institucional (rota "/cadastro").
 * -----------------------------------------------------------------------------
 * Mockup desktop "Cadastro institucional": título "Suas ideias começam aqui.",
 * cards de perfil ("Como você participa da faculdade?"), seções "Seus dados"
 * (nome, e-mail e — somente no perfil Aluno — matrícula, curso travado no
 * DSM e período; professor e coordenação não preenchem dados de estudante)
 * e "Crie sua senha"
 * (senha + confirmação), consentimento com links, botão "Criar conta de
 * <perfil>", aviso "Confirme seu vínculo institucional!" e rodapé.
 * Ao selecionar um card de perfil a escolha reage com a MESMA animação
 * do login (pop + check, keyframes com reduced-motion).
 * Sem card wrapper: conteúdo centralizado com máx. 800px.
 * Após criar a conta, o usuário é levado ao login.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiCircle,
  FiMail,
  FiMonitor,
  FiShield,
  FiSliders,
  FiUser,
} from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE } from '../../mocks/projectsMock.js';
import { LOGIN_PROFILES } from '../../mocks/usersMock.js';
import styles from './SignupPage.module.css';

/** Ícone de cada perfil de acesso (mesmos do login). */
const PROFILE_ICONS = {
  graduation: FiBookOpen,
  monitor: FiMonitor,
  sliders: FiSliders,
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [profile, setProfile] = useState('aluno');

  /** Rótulo do perfil escolhido — usado no botão ("Criar conta de aluno"). */
  const profileLabel =
    LOGIN_PROFILES.find((item) => item.role === profile)?.label ?? 'aluno';

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

      <header className={styles.header}>
        <h1 className={styles.title}>Suas ideias começam aqui.</h1>
        <p className={styles.subtitle}>
          Faça parte do PI² com sua conta institucional. Os campos com * são
          obrigatórios.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* ------------------------------------ perfil de participação */}
        <fieldset className={styles.profileGroup}>
          <legend className={styles.groupLabel}>
            Como você participa da faculdade?
          </legend>
          <div className={styles.profileGrid}>
            {LOGIN_PROFILES.map((item) => {
              const Icon = PROFILE_ICONS[item.icon];
              const active = profile === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  className={`${styles.profileCard} ${active ? styles.profileActive : ''}`}
                  aria-pressed={active}
                  onClick={() => setProfile(item.role)}
                >
                  <span className={styles.profileTop}>
                    <Icon size={20} aria-hidden="true" />
                    {/* wrapper do check: recebe o pop da seleção */}
                    <span className={styles.profileCheck}>
                      {active ? (
                        <FiCheckCircle size={18} aria-hidden="true" />
                      ) : (
                        <FiCircle size={18} aria-hidden="true" />
                      )}
                    </span>
                  </span>
                  <span className={styles.profileName}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <h2 className={styles.sectionTitle}>Seus dados</h2>

        <TextField
          label="Nome completo"
          required
          autoComplete="name"
          placeholder="Ana Costa"
          icon={<FiUser size={18} aria-hidden="true" />}
        />
        <TextField
          label="E-mail institucional"
          type="email"
          required
          autoComplete="email"
          placeholder="ana.costa@aluno.faculdade.edu.br"
          hint="Use o e-mail fornecido pela sua faculdade."
          icon={<FiMail size={18} aria-hidden="true" />}
        />

        {/* Dados de ESTUDANTE (matrícula, curso travado e período): aparecem
            apenas no perfil Aluno — professor e coordenação não os preenchem. */}
        {profile === 'aluno' && (
          <div className={styles.row3}>
            <TextField label="Matrícula" required placeholder="202610248" />
            {/* Curso travado no DSM — não pode ser alterado no cadastro. */}
            <TextField label="Curso" value={COURSE} locked readOnly />
            <Select label="Período" required defaultValue="4">
              <option value="1">1º período</option>
              <option value="2">2º período</option>
              <option value="3">3º período</option>
              <option value="4">4º período</option>
              <option value="5">5º período</option>
              <option value="6">6º período</option>
            </Select>
          </div>
        )}

        <h2 className={styles.sectionTitle}>Crie sua senha</h2>

        <div className={styles.row2}>
          <TextField
            label="Senha"
            type="password"
            required
            autoComplete="new-password"
            hint="Use pelo menos 8 caracteres, letras e números."
          />
          <TextField
            label="Confirmar senha"
            type="password"
            required
            autoComplete="new-password"
          />
        </div>

        <label className={styles.agree}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span>
            Li e aceito os <a href="#termos">Termos de uso</a> e a{' '}
            <a href="#privacidade">Política de privacidade</a> do PI².
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!agreed}
          icon={<FiArrowRight aria-hidden="true" />}
        >
          Criar conta de {profileLabel.toLowerCase()}
        </Button>
      </form>

      <aside className={styles.vinculo}>
        <FiShield aria-hidden="true" />
        <div>
          <strong>Confirme seu vínculo institucional!</strong>
          <p>
            Após o cadastro, enviaremos as instruções de confirmação para seu
            e-mail institucional.
          </p>
        </div>
      </aside>

      <p className={styles.login}>
        Já tenho conta · <Link to="/login">Entrar</Link>
      </p>

      <footer className={styles.footer}>
        <span>PI² · Ideias que multiplicam conhecimento</span>
        <span className={styles.footerLinks}>
          <a href="#termos">Termos de uso</a>
          {' · '}
          <a href="#privacidade">Política de privacidade</a>
        </span>
      </footer>
    </div>
  );
}
