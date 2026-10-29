import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/ui/Logo/Logo';
import Button from '../../components/ui/Button/Button';
import { ArrowRight, Users } from '../../components/icons';
import './WelcomePage.css';

/**
 * Tela de boas-vindas (ponto de entrada da aplicação).
 * Estrutura estática: sem chamadas de serviço.
 */
export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <main className="welcome__content">
        <section className="welcome__brand" aria-label="Logotipo do PI²">
          <Logo variant="stack-lg" />
          <span className="welcome__brand-word">PI²</span>
        </section>

        <p className="welcome__eyebrow">Repositório acadêmico</p>

        <h1 className="welcome__title">
          Grandes ideias.
          <br />
          Conhecimento
          <br />
          que se conecta.
        </h1>

        <p className="welcome__description">
          Projetos de todos os cursos em um só lugar. Compartilhe descobertas e
          construa o futuro da nossa faculdade.
        </p>

        <div className="welcome__feature">
          <span className="welcome__feature-icon" aria-hidden="true">
            <Users size={20} />
          </span>
          <div className="welcome__feature-text">
            <strong>Feito por alunos. Conectado a professores.</strong>
            <span>Da primeira ideia ao projeto publicado.</span>
          </div>
        </div>

        <div className="welcome__actions">
          <Button fullWidth onClick={() => navigate('/acessar')}>
            Entrar no PI² <ArrowRight size={20} />
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/acessar')}>
            Criar minha conta
          </Button>
        </div>

        <p className="welcome__note">
          Seu e-mail institucional é a sua porta de entrada.
        </p>
      </main>

      <footer className="welcome__footer">
        PI² · Ideias que multiplicam conhecimento
      </footer>
    </div>
  );
}
