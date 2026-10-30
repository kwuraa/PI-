import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage/WelcomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import StudentProjectsPage from './pages/StudentProjectsPage/StudentProjectsPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SavedProjectsPage from './pages/SavedProjectsPage/SavedProjectsPage';
import ReviewProjectPage from './pages/ReviewProjectPage/ReviewProjectPage';
import PublishProjectPage from './pages/PublishProjectPage/PublishProjectPage';
import ProfessorGradesPage from './pages/ProfessorGradesPage/ProfessorGradesPage';
import CoordinatorGradesPage from './pages/CoordinatorGradesPage/CoordinatorGradesPage';
import SubmissionConfirmationPage from './pages/SubmissionConfirmationPage/SubmissionConfirmationPage';
import ProjectAnalysisPage from './pages/ProjectAnalysisPage/ProjectAnalysisPage';
import ReviewResultPage from './pages/ReviewResultPage/ReviewResultPage';
import ProfessorSubmissionsPage from './pages/ProfessorSubmissionsPage/ProfessorSubmissionsPage';
import ProfessorDeliveryPage from './pages/ProfessorDeliveryPage/ProfessorDeliveryPage';
import PublicProjectPage from './pages/PublicProjectPage/PublicProjectPage';
import MyProjectPage from './pages/MyProjectPage/MyProjectPage';
import ProfessorCriteriaPage from './pages/ProfessorCriteriaPage/ProfessorCriteriaPage';
import CoordinatorCriteriaPage from './pages/CoordinatorCriteriaPage/CoordinatorCriteriaPage';
import CoordinatorGroupsPage from './pages/CoordinatorGroupsPage/CoordinatorGroupsPage';
import ProfessorReportPage from './pages/ProfessorReportPage/ProfessorReportPage';
import CoordinatorTeacherEvaluationPage from './pages/CoordinatorTeacherEvaluationPage/CoordinatorTeacherEvaluationPage';
import CoordinatorPeerReviewsPage from './pages/CoordinatorPeerReviewsPage/CoordinatorPeerReviewsPage';
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage';

/**
 * Mapa de rotas da aplicação.
 * As telas ainda não implementadas apontam para o PlaceholderPage,
 * mantendo a navegação completa desde a primeira entrega.
 */
export default function App() {
  return (
    <Routes>
      {/* Área pública */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/acessar" element={<LoginPage />} />

      {/* Área logada — aluno */}
      <Route
        path="/meus-projetos"
        element={<StudentProjectsPage />}
      />
      <Route
        path="/meus-projetos/novo"
        element={<PublishProjectPage />}
      />
      <Route
        path="/meus-projetos/enviado"
        element={<SubmissionConfirmationPage />}
      />
      <Route
        path="/meus-projetos/:slug/analise"
        element={<ProjectAnalysisPage />}
      />
      <Route
        path="/meus-projetos/:slug"
        element={<MyProjectPage />}
      />

      {/* Área logada — professor/coordenador */}
      <Route path="/painel" element={<DashboardPage />} />

      {/* Destinos do painel — telas das próximas etapas */}
      <Route
        path="/professor/notas"
        element={<ProfessorGradesPage />}
      />
      <Route
        path="/coordenador/notas"
        element={<CoordinatorGradesPage />}
      />
      <Route
        path="/professor/revisar/:slug"
        element={<ReviewProjectPage />}
      />
      <Route
        path="/professor/revisar/:slug/resultado"
        element={<ReviewResultPage />}
      />
      <Route path="/professor/entregas" element={<ProfessorSubmissionsPage />} />
      <Route
        path="/professor/entregas/:slug"
        element={<ProfessorDeliveryPage />}
      />
      <Route
        path="/professor/criterios"
        element={<ProfessorCriteriaPage />}
      />
      <Route
        path="/professor/criterios/:id"
        element={<PlaceholderPage title="Editar critério" />}
      />
      <Route
        path="/professor/relatorio"
        element={<ProfessorReportPage />}
      />
      <Route
        path="/coordenador/grupos"
        element={<CoordinatorGroupsPage />}
      />
      <Route
        path="/coordenador/grupos/:id/link"
        element={<PlaceholderPage title="Adicionar link de documentação" />}
      />
      <Route
        path="/coordenador/grupos/:id"
        element={<PlaceholderPage title="Detalhe do grupo" />}
      />
      <Route
        path="/coordenador/paritarias"
        element={<CoordinatorPeerReviewsPage />}
      />
      <Route
        path="/coordenador/criterios"
        element={<CoordinatorCriteriaPage />}
      />
      <Route
        path="/coordenador/criterios/novo"
        element={<PlaceholderPage title="Novo critério geral" />}
      />
      <Route
        path="/coordenador/criterios/:id"
        element={<PlaceholderPage title="Editar critério geral" />}
      />
      <Route
        path="/coordenador/desempenho"
        element={<CoordinatorTeacherEvaluationPage />}
      />
      <Route
        path="/coordenador/relatorio"
        element={<PlaceholderPage title="Relatório consolidado" />}
      />
      <Route
        path="/coordenador/avaliar"
        element={<PlaceholderPage title="Avaliar docentes" />}
      />
      <Route
        path="/coordenador/entregaveis"
        element={<PlaceholderPage title="Entregáveis pendentes" />}
      />
      <Route path="/explorar" element={<ExplorePage />} />
      <Route path="/projetos/:slug" element={<ProjectDetailsPage />} />
      <Route
        path="/projetos/:slug/publico"
        element={<PublicProjectPage />}
      />
      <Route path="/salvos" element={<SavedProjectsPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route
        path="/perfil/alterar-senha"
        element={<PlaceholderPage title="Alterar senha" />}
      />
      <Route
        path="/perfil/privacidade"
        element={<PlaceholderPage title="Privacidade e termos de uso" />}
      />
      <Route
        path="/perfil/ajuda"
        element={<PlaceholderPage title="Ajuda e suporte" />}
      />

      {/* Qualquer outra URL volta ao início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
