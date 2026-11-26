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
