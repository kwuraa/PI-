import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar/TopBar';
import BottomNav from '../../components/layout/BottomNav/BottomNav';
import PageShell from '../../components/layout/PageShell/PageShell';
import Button from '../../components/ui/Button/Button';
import { ArrowRight } from '../../components/icons';
import './PlaceholderPage.css';

/**
 * Página genérica para rotas que ainda não têm tela.
 * Mantém a navegação funcional enquanto as telas não chegam.
 */
export default function PlaceholderPage({ title }) {
  return (
    <>
      <div className="placeholder-page">
        <TopBar title={title} />
        <PageShell>
          <section className="placeholder">
            <h1 className="placeholder__title">{title}</h1>
            <p className="placeholder__description">
              Esta tela será implementada nas próximas etapas do projeto. A
              navegação e a arquitetura já estão prontas para recebê-la.
            </p>
            <Link to="/painel">
              <Button fullWidth>
                Voltar ao painel <ArrowRight size={20} />
              </Button>
            </Link>
          </section>
        </PageShell>
      </div>

      <BottomNav />
    </>
  );
}
