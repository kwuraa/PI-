/**
 * PI² — Painel da equipe (rota "/painel").
 * -----------------------------------------------------------------------------
 * Um único ponto de entrada que escolhe a face conforme o espaço ativo:
 *  • só 'professor'   → ProfessorFace (fila de revisão + orientações);
 *  • só 'coordenador' → CoordinatorFace (métricas + alerta + áreas);
 *  • os dois (unido)  → UnifiedFace com abas "Painel unificado | Atalhos"
 *                       (a aba Atalhos tem h1 próprio, como no mockup 07).
 * As três faces vivem em components/staff/ (separação "um componente por
 * arquivo" — item 6) e leem os números dos mocks (fila de revisão, grupos,
 * entregáveis) via staffMetrics.js — nada fixo.
 */
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
