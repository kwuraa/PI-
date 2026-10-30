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
        element={<PlaceholderPage title="Meus critérios" />}
      />
      <Route
        path="/professor/relatorio"
        element={<PlaceholderPage title="Relatório por turma" />}
      />
      <Route
        path="/coordenador/grupos"
        element={<PlaceholderPage title="Gestão de grupos" />}
      />
      <Route
        path="/coordenador/paritarias"
        element={<PlaceholderPage title="Avaliação paritária" />}
      />
      <Route
        path="/coordenador/criterios"
        element={<PlaceholderPage title="Critérios do curso" />}
      />
      <Route
        path="/coordenador/desempenho"
        element={<PlaceholderPage title="Desempenho docente" />}
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
