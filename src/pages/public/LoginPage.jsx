/**
 * PI² — Acesso à conta (rota "/login").
 * -----------------------------------------------------------------------------
 * Chaveamento de perfis SIMULADO: escolher um card (Aluno, Professor,
 * Coordenador, Secretaria) preenche o e-mail e define o papel do login —
 * a senha NÃO é validada (protótipo). Após entrar, redireciona para o
 * espaço do perfil (ou para a rota que originou o acesso).
 */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCircle,
  FiFolder,
  FiBookOpen,
  FiMonitor,
  FiShield,
  FiSliders,
} from "react-icons/fi";

import Button from "../../components/ui/Button/Button.jsx";
import TextField from "../../components/ui/TextField/TextField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { LOGIN_PROFILES, MOCK_USERS } from "../../mocks/usersMock.js";
import styles from "./LoginPage.module.css";

/** Ícone de cada perfil de acesso (react-icons/feather). */
const PROFILE_ICONS = {
  graduation: FiBookOpen,
  monitor: FiMonitor,
  sliders: FiSliders,
  folder: FiFolder,
};

/** Para onde cada perfil vai ao entrar. */
const HOME_BY_ROLE = {
  aluno: "/aluno",
  professor: "/painel",
  coordenador: "/painel",
  secretaria: "/secretaria/cursos",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState("aluno");

  /** Usuário do role — prefere perfil dedicado (evita multiperfil trocado). */
  const userForRole = (r) =>
    MOCK_USERS.find((u) => u.roles.length === 1 && u.roles[0] === r) ??
    MOCK_USERS.find((u) => u.roles.includes(r)) ??
    MOCK_USERS[0];

  const selectedUser = userForRole(role);
  const [email, setEmail] = useState(selectedUser.email);

  /** Troca o perfil e sincroniza o e-mail institucional exibido. */
  const handleSelect = (nextRole) => {
    const nextUser = userForRole(nextRole);
    setRole(nextRole);
    if (nextUser) setEmail(nextUser.email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(role);
    const from = location.state?.from ?? HOME_BY_ROLE[role] ?? "/explorar";
    navigate(from, { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate("/")}
          aria-label="Voltar para a boas-vindas"
        >
          <FiArrowLeft size={20} aria-hidden="true" />
          <span className={styles.backLabel}>Acessar o PI²</span>
        </button>
      </div>

      <h1 className={styles.title}>Bom ter você aqui.</h1>
      <p className={styles.subtitle}>
        Entre com sua conta institucional para continuar suas ideias.
      </p>

      {/* -------------------------------------- cards de perfil */}
      <fieldset className={styles.profiles}>
        <legend className={styles.profilesLabel}>
          Como você acessa o PI²?
        </legend>
        <div className={styles.profileGrid}>
          {LOGIN_PROFILES.map((profile) => {
            const Icon = PROFILE_ICONS[profile.icon];
            const active = role === profile.role;
            return (
              <button
                key={profile.role}
                type="button"
                className={`${styles.profileCard} ${active ? styles.profileActive : ""}`}
                aria-pressed={active}
                onClick={() => handleSelect(profile.role)}
              >
                <span className={styles.profileMark} aria-hidden="true">
                  {active ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                </span>
                <Icon size={22} aria-hidden="true" />
                <span>{profile.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* --------------------------------------------------- form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="E-mail institucional"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <TextField
          label="Senha"
          type="password"
          required
          defaultValue="pi2demo"
          autoComplete="current-password"
        />

        <div className={styles.formRow}>
          <label className={styles.remember}>
            <input type="checkbox" defaultChecked />
            Lembrar de mim
          </label>
          <Link to="/recuperar-senha" className={styles.forgot}>
            Esqueci minha senha
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          iconAfter={<FiArrowRight aria-hidden="true" />}
        >
          Entrar como {role}
        </Button>
      </form>

      <div className={styles.info}>
        <span className={styles.infoIcon}>
          <FiShield aria-hidden="true" />
        </span>
        <div>
          <strong>Um espaço para toda a faculdade</strong>
          <p>
            Alunos publicam e descobrem projetos. Professores orientam, revisam
            e aprovam.
          </p>
        </div>
      </div>

      <p className={styles.signup}>
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </div>
  );
}
