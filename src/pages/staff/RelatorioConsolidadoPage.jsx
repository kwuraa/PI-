import CohortReport from '../../components/staff/CohortReport.jsx';
import SemesterReport from '../../components/staff/SemesterReport.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Rota "/painel/relatorio-consolidado" (exclusiva da coordenação).
 * O duplo papel (coordenador + professor) vê a face da coorte; o papel
 * apenas coordenador vê a face do semestre vigente.
 */
export default function RelatorioConsolidadoPage() {
  const { isRole } = useAuth();
  // Sem wrapper: as faces devolvem fragmento, como no original (o respiro
  // vertical vem do stage da MainLayout — adicionar um `.page` aqui mudaria
  // o DOM e o espaçamento entre os blocos).
  return isRole('professor') ? <CohortReport /> : <SemesterReport />;
}
