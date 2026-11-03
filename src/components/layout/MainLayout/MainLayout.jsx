import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../BottomNav/BottomNav';
import { getNavItems } from '../../../config/navigation';
import './MainLayout.css';

/**
 * Layout das telas logadas.
 *
 * A BottomNav vive AQUI (fora das páginas): ela não desmonta entre
 * navegações — nem durante o "carregamento" da nova tela. O conteúdo
 * da rota entra suavemente a cada troca (a chave no stage força a
 * remontagem, disparando a animação de entrada).
 */
export default function MainLayout() {
  const { pathname } = useLocation();
  const items = getNavItems(pathname);

  return (
    <>
      <div className="main-layout__stage" key={pathname}>
        <Outlet />
      </div>

      <BottomNav items={items} />
    </>
  );
}
