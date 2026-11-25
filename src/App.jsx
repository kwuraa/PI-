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
 *  • React.lazy   → as 25 telas são importadas por chunk (item 7) e o
 *    <Suspense> mostra o RouteFallback enquanto o chunk chega; layouts,
 *    guardas e mockados continuam síncronos no bundle principal.
 *
 * Regras RBAC (useAuth):
 *  • /aluno*            → apenas 'aluno';
 *  • /painel*           → 'professor' | 'coordenador';
 *  • /painel/grupos     → 'coordenador';
 *  • /painel/relatorio-consolidado → 'coordenador' (face da coorte quando o
 *    papel é coordenador + professor);
 *  • /secretaria/cursos → 'secretaria';
 *  • /perfil            → qualquer usuário logado (visitante vê o convite).
 */
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout/MainLayout.jsx';
import PublicLayout from './components/layout/PublicLayout/PublicLayout.jsx';
import RequireRole from './components/routing/RequireRole.jsx';
import RouteFallback from './components/routing/RouteFallback.jsx';
import StackShell from './components/routing/StackShell.jsx';
import { getProjectBySlug } from './mocks/projectsMock.js';

/* ------------------------------------------------------------------ telas
   React.lazy (item 7): cada rota importa seu próprio chunk, então o bundle
   principal fica só com o shell (layouts, contextos, mocks e componentes de
   UI) e o aviso de chunk >500 kB desaparece. Nenhum outro arquivo importa
   pages, então o split é completo. */
const WelcomePage = lazy(() => import('./pages/public/WelcomePage.jsx'));
const LoginPage = lazy(() => import('./pages/public/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/public/SignupPage.jsx'));
const RecoveryPage = lazy(() => import('./pages/public/RecoveryPage.jsx'));
const TermsPage = lazy(() => import('./pages/public/TermsPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage.jsx'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage.jsx'));
const ExplorePage = lazy(() => import('./pages/ExplorePage.jsx'));
const ProjectPage = lazy(() => import('./pages/ProjectPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const HelpPage = lazy(() => import('./pages/HelpPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const MyProjectsPage = lazy(() => import('./pages/aluno/MyProjectsPage.jsx'));
const NewProjectPage = lazy(() => import('./pages/aluno/NewProjectPage.jsx'));
const ProjectStatusPage = lazy(
  () => import('./pages/aluno/ProjectStatusPage.jsx')
);
const StaffPanelPage = lazy(() => import('./pages/staff/StaffPanelPage.jsx'));
const DeliveriesPage = lazy(() => import('./pages/staff/DeliveriesPage.jsx'));
const ReviewPage = lazy(() => import('./pages/staff/ReviewPage.jsx'));
const ReviewResultPage = lazy(
  () => import('./pages/staff/ReviewResultPage.jsx')
);
const DeliveryPage = lazy(() => import('./pages/staff/DeliveryPage.jsx'));
const EvolutionPage = lazy(() => import('./pages/staff/EvolutionPage.jsx'));
const GroupsPage = lazy(() => import('./pages/staff/GroupsPage.jsx'));
const RelatorioConsolidadoPage = lazy(
  () => import('./pages/staff/RelatorioConsolidadoPage.jsx')
);
const ProfessorProjectPage = lazy(
  () => import('./pages/staff/ProfessorProjectPage.jsx')
);
const CoursesPage = lazy(() => import('./pages/secretary/CoursesPage.jsx'));

/** Título da barra em /projeto/:slug — usa o título do projeto mockado. */
const projectTitle = ({ slug }) => getProjectBySlug(slug)?.title ?? 'Projeto';

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* ---------------------------------------------- telas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/recuperar-senha" element={<RecoveryPage />} />
          <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
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

          {/* troca de senha (conta) — qualquer usuário logado */}
          <Route
            path="/alterar-senha"
            element={
              <RequireRole>
                <ChangePasswordPage />
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
    </Suspense>
  );
}
