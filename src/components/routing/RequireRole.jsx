/**
 * PI² — Guarda de rota por papel (RBAC).
 * -----------------------------------------------------------------------------
 * Extraído de App.jsx na separação "um componente por arquivo" (item 6).
 *
 * Regras:
 *  • sem login  → redireciona para /login guardando o destino em `state.from`
 *    (a página de login devolve o usuário para onde ele tentou entrar);
 *  • com login, mas sem nenhum dos `roles` indicados → destino seguro do
 *    perfil (/aluno ou /painel), evitando telas de acesso negado.
 *  • sem `roles`, qualquer usuário logado passa (ex.: /perfil, /alterar-senha).
 *
 * Uso (dentro das rotas do App):
 *   <Route element={<RequireRole roles={['aluno']}>…</RequireRole>} />
 */
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';

export default function RequireRole({ roles, children }) {
  const { user, isRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.some(isRole)) {
    const home = isRole('aluno') ? '/aluno' : '/painel';
    return <Navigate to={home} replace />;
  }
  return children;
}
