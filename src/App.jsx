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
        element={<PlaceholderPage title="Novo projeto" />}
      />

      {/* Área logada — professor/coordenador */}
      <Route path="/painel" element={<DashboardPage />} />
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
