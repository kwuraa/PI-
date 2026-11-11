/**
 * PI² — Roteamento da aplicação (React Router v6).
 * -----------------------------------------------------------------------------
 * Estrutura:
 *  • PublicLayout → telas públicas/autenticadas sem BottomNav
 *    (boas-vindas, login, cadastro, recuperação de senha);
 *  • MainLayout   → área do sistema com TopBar + BottomNav persistentes;
 *  • StackShell   → variantes de barra superior empilhada (detalhes), que
 *    resolvem o título a partir dos parâmetros da rota.
 *
 * Regras RBAC (useAuth):
 *  • /aluno*            → apenas 'aluno';
 *  • /painel*           → 'professor' | 'coordenador';
 *  • /painel/grupos     → 'coordenador';
 *  • /secretaria/cursos → 'secretaria';
 *  • /perfil            → qualquer usuário logado (visitante vê o convite).
 */
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout/MainLayout.jsx';
import PublicLayout from './components/layout/PublicLayout/PublicLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { getProjectBySlug } from './mocks/projectsMock.js';

import WelcomePage from './pages/public/WelcomePage.jsx';
import AccessPage from './pages/public/AccessPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import RecoveryPage from './pages/public/RecoveryPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import MyProjectsPage from './pages/aluno/MyProjectsPage.jsx';
import NewProjectPage from './pages/aluno/NewProjectPage.jsx';
import ProjectStatusPage from './pages/aluno/ProjectStatusPage.jsx';
import StaffPanelPage from './pages/staff/StaffPanelPage.jsx';
import ReviewPage from './pages/staff/ReviewPage.jsx';
import ReviewResultPage from './pages/staff/ReviewResultPage.jsx';
import DeliveryPage from './pages/staff/DeliveryPage.jsx';
import EvolutionPage from './pages/staff/EvolutionPage.jsx';
import GroupsPage from './pages/staff/GroupsPage.jsx';
import ProfessorProjectPage from './pages/staff/ProfessorProjectPage.jsx';
import CoursesPage from './pages/secretary/CoursesPage.jsx';

/**
 * Guarda de rotas: exige login e, opcionalmente, um dos roles indicados.
 * Sem login → /login (guardando o destino para voltar depois).
 * Com login, mas sem o role → destino seguro do perfil (/painel ou /aluno).
 */
function RequireRole({ roles, children }) {
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

/**
 * Barra superior empilhada (voltar + título).
 * `resolveTitle(params)` monta o título com os parâmetros da rota
 * (ex.: título real do projeto em /projeto/:slug).
 */
function StackShell({ resolveTitle, fallback = '' }) {
  const params = useParams();
  // resolveTitle é opcional: rotas sem ela (ex.: /aluno/novo, /painel/meu-projeto)
  // usam direto o fallback como título da barra empilhada.
  return <MainLayout barVariant="stack" title={resolveTitle?.(params) ?? fallback} />;
}

/** Título da barra em /projeto/:slug — usa o título do projeto mockado. */
const projectTitle = ({ slug }) => getProjectBySlug(slug)?.title ?? 'Projeto';

export default function App() {
  return (
    <Routes>
      {/* ---------------------------------------------- telas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
        {/* Tela intermediária boas-vindas → login (hero de acesso). */}
        <Route path="/acesso" element={<AccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/recuperar-senha" element={<RecoveryPage />} />
      </Route>

      {/* ----------------------------------- barra brand (logo + espaço) */}
      <Route element={<MainLayout />}>
        <Route path="/explorar" element={<ExplorePage />} />
        <Route
          path="/perfil"
          element={
            <RequireRole>
              <ProfilePage />
            </RequireRole>
          }
        />

        {/* aluno */}
        <Route
          path="/aluno"
          element={
            <RequireRole roles={['aluno']}>
              <MyProjectsPage />
            </RequireRole>
          }
        />

        {/* professor / coordenador */}
        <Route
          path="/painel"
          element={
            <RequireRole roles={['professor', 'coordenador']}>
              <StaffPanelPage />
            </RequireRole>
          }
        />
        <Route
          path="/painel/evolucao"
          element={
            <RequireRole roles={['professor', 'coordenador']}>
              <EvolutionPage />
            </RequireRole>
          }
        />
        <Route
          path="/painel/grupos"
          element={
            <RequireRole roles={['coordenador']}>
              <GroupsPage />
            </RequireRole>
          }
        />

        {/* secretaria */}
        <Route
          path="/secretaria/cursos"
          element={
            <RequireRole roles={['secretaria']}>
              <CoursesPage />
            </RequireRole>
          }
        />
      </Route>

      {/* ---------------------------- barra empilhada (detalhes/fluxos) */}
      <Route
        path="/projeto/:slug"
        element={<StackShell resolveTitle={projectTitle} fallback="Projeto" />}
      >
        {/* Aberto a visitantes: a página decide entre leitura pública
            (LGPD, sem nomes) e visão completa do usuário logado. */}
        <Route index element={<ProjectPage />} />
      </Route>

      <Route
        path="/aluno/novo"
        element={<StackShell fallback="Novo projeto" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['aluno']}>
              <NewProjectPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/aluno/status/:slug"
        element={<StackShell resolveTitle={projectTitle} fallback="Acompanhar análise" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['aluno']}>
              <ProjectStatusPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/painel/revisar/:slug"
        element={<StackShell fallback="Revisão do projeto" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['professor']}>
              <ReviewPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/painel/resultado/:slug"
        element={<StackShell fallback="Resultado da análise" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['professor']}>
              <ReviewResultPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/painel/entrega/:slug"
        element={<StackShell fallback="Detalhe da entrega" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['professor', 'coordenador']}>
              <DeliveryPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/painel/meu-projeto"
        element={<StackShell fallback="Meu projeto e materiais" />}
      >
        <Route
          index
          element={
            <RequireRole roles={['professor']}>
              <ProfessorProjectPage />
            </RequireRole>
          }
        />
      </Route>

      {/* ------------------------------------------- fallback / 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
