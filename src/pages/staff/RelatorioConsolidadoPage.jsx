/**
 * PI² — Relatório consolidado (rota "/painel/relatorio-consolidado").
 * -----------------------------------------------------------------------------
 * Uma única rota com DUAS faces (mesmo padrão do StaffPanelPage), escolhidas
 * pelo papel ativo:
 *  • só coordenador          → SemesterReport (mockup 06);
 *  • coordenador + professor  → CohortReport   (mockup 08, face da coorte).
 *
 * As duas faces vivem em components/staff/ e as classes de estrutura
 * compartilhadas em ReportShared.module.css (separação "um componente por
 * arquivo" — item 6). Fonte única dos grupos e alunos: GROUPS em
 * src/mocks/projectsMock.js; os demais números são os indicadores parciais
 * do mockup (ver o JSDoc de cada face).
 *
 * Observação de regra: as barras usam classes de largura/altura prontas no
 * CSS Module, porque o projeto proíbe estilo inline nos elementos JSX.
 * Exportação: "Exportar relatório em PDF", "Exportar PDF" e "Imprimir" chamam
 * window.print() — é SIMULAÇÃO, não há geração real de PDF (ver JSDoc de
 * handlePrint em reportShared.js).
 */
import CohortReport from '../../components/staff/CohortReport.jsx';
import SemesterReport from '../../components/staff/SemesterReport.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Rota "/painel/relatorio-consolidado" (exclusiva da coordenação).
 * O duplo papel (coordenador + professor) vê a face da coorte; o papel
 * apenas coordenador vê a face do semestre vigente — como nos mockups.
 */
export default function RelatorioConsolidadoPage() {
  const { isRole } = useAuth();
  // Sem wrapper: as faces devolvem fragmento, como no original (o respiro
  // vertical vem do stage da MainLayout — adicionar um `.page` aqui mudaria
  // o DOM e o espaçamento entre os blocos).
  return isRole('professor') ? <CohortReport /> : <SemesterReport />;
}
