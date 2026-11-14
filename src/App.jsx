/**
 * PI² — Roteamento da aplicação (React Router v6).
 * -----------------------------------------------------------------------------
 * Estrutura:
 *  • PublicLayout → telas públicas/autenticadas sem BottomNav
 *    (boas-vindas, login, cadastro, recuperação de senha);
 *  • MainLayout   → área do sistema com TopBar + BottomNav persistentes.
 *    Recebe também os fluxos do aluno (/aluno/novo e /aluno/status/:slug):
 *    nos mockups 03 eles abrem com a barra BRAND (logo + espaço do aluno) e
 *    o breadcrumb "PI² / Meus projetos / …", não a barra empilhada;
 *  • StackShell   → variantes de barra superior empilhada (detalhes), que
 *    resolvem o título a partir dos parâmetros da rota (/projeto/:slug e
 *    as rotas /painel/* de detalhe).
 *
 * Regras RBAC (useAuth):
 *  • /aluno*            → apenas 'aluno';
 *  • /painel*           → 'professor' | 'coordenador';
 *  • /painel/criterios  → 'professor' (créditos da disciplina);
 *  • /painel/grupos     → 'coordenador';
 *  • /painel/relatorio-consolidado → 'coordenador' (face da coorte quando o
 *    papel é coordenador + professor);
 *  • /secretaria/cursos → 'secretaria';
 *  • /perfil            → qualquer usuário logado (visitante vê o convite).
 */
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import MainLayout from './components/layout/MainLayout/MainLayout.jsx';
import PublicLayout from './components/layout/PublicLayout/PublicLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { getProjectBySlug } from './mocks/projectsMock.js';

import WelcomePage from './pages/public/WelcomePage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import RecoveryPage from './pages/public/RecoveryPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import MyProjectsPage from './pages/aluno/MyProjectsPage.jsx';
import NewProjectPage from './pages/aluno/NewProjectPage.jsx';
import ProjectStatusPage from './pages/aluno/ProjectStatusPage.jsx';
import StaffPanelPage from './pages/staff/StaffPanelPage.jsx';
import CriteriosPage from './pages/staff/CriteriosPage.jsx';
import DeliveriesPage from './pages/staff/DeliveriesPage.jsx';
import ReviewPage from './pages/staff/ReviewPage.jsx';
import ReviewResultPage from './pages/staff/ReviewResultPage.jsx';
import DeliveryPage from './pages/staff/DeliveryPage.jsx';
import EvolutionPage from './pages/staff/EvolutionPage.jsx';
import GroupsPage from './pages/staff/GroupsPage.jsx';
import RelatorioConsolidadoPage from './pages/staff/RelatorioConsolidadoPage.jsx';
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
 * `resolveTitle(params, search)` monta o título com os parâmetros da rota e
 * da query string (ex.: título real do projeto em /projeto/:slug).
 * Observação: /aluno/novo e /aluno/status/:slug NÃO passam mais por aqui —
 * nos mockups 03 eles usam a barra brand (MainLayout), que monta a 3ª linha
 * do breadcrumb com useSearchParams.
 */
function StackShell({ resolveTitle, fallback = '' }) {
  const params = useParams();
  const [search] = useSearchParams();
  // resolveTitle é opcional: rotas sem ela (ex.: /painel/meu-projeto,
  // /painel/revisar/:slug) usam direto o fallback como título da barra.
  return (
    <MainLayout barVariant="stack" title={resolveTitle?.(params, search) ?? fallback} />
  );
}

/** Título da barra em /projeto/:slug — usa o título do projeto mockado. */
const projectTitle = ({ slug }) => getProjectBySlug(slug)?.title ?? 'Projeto';

export default function App() {
  return (
    <Routes>
      {/* ---------------------------------------------- telas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
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

        {/* ajuda e suporte (aberta a visitantes e logados) */}
        <Route path="/ajuda" element={<HelpPage />} />

        {/* aluno — barra brand + breadcrumb "PI² / Meus projetos / …"
            (mockups 03: "Novo projeto" e "Enviado para análise!") */}
        <Route
          path="/aluno"
          element={
            <RequireRole roles={['aluno']}>
              <MyProjectsPage />
            </RequireRole>
          }
        />
        <Route
          path="/aluno/novo"
          element={
            <RequireRole roles={['aluno']}>
              <NewProjectPage />
            </RequireRole>
          }
        />
        <Route
          path="/aluno/status/:slug"
          element={
            <RequireRole roles={['aluno']}>
              <ProjectStatusPage />
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
        {/* professor — critérios de avaliação da disciplina (mockup 05) */}
        <Route
          path="/painel/criterios"
          element={
            <RequireRole roles={['professor']}>
              <CriteriosPage />
            </RequireRole>
          }
        />
        <Route
          path="/painel/entregas"
          element={
            <RequireRole roles={['professor', 'coordenador']}>
              <DeliveriesPage />
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
        {/* relatório consolidado (duas faces: semestre 06 / coorte 08) */}
        <Route
          path="/painel/relatorio-consolidado"
          element={
            <RequireRole roles={['coordenador']}>
              <RelatorioConsolidadoPage />
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
        path="/painel/revisar/:slug"
        element={<StackShell fallback="Revisar projeto" />}
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
