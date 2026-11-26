import CoordinatorFace from '../../components/staff/CoordinatorFace.jsx';
import ProfessorFace from '../../components/staff/ProfessorFace.jsx';
import UnifiedFace from '../../components/staff/UnifiedFace.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './StaffPanel.module.css';

export default function StaffPanelPage() {
  const { user, isRole } = useAuth();
  const isProfessor = isRole('professor');
  const isCoordinator = isRole('coordenador');

  const face =
    isProfessor && isCoordinator ? (
      <UnifiedFace user={user} />
    ) : isProfessor ? (
      <ProfessorFace user={user} />
    ) : (
      <CoordinatorFace />
    );

  // As faces devolvem fragmento; o `.page` é quem envolve o conteúdo e
  // aplica o respiro vertical (header → métricas → colunas). Sem esse
  // wrapper, as seções colam umas nas outras direto no stage.
  return <div className={styles.page}>{face}</div>;
}
