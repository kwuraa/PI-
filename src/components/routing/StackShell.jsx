/**
 * PI² — Barra superior empilhada (voltar + título) para rotas de detalhe.
 * -----------------------------------------------------------------------------
 * Extraído de App.jsx na separação "um componente por arquivo" (item 6).
 *
 * `resolveTitle(params, search)` monta o título com os parâmetros da rota e
 * da query string (ex.: título real do projeto em /projeto/:slug); rotas sem
 * `resolveTitle` usam o `fallback` direto na barra.
 *
 * Observação: /aluno/novo e /aluno/status/:slug NÃO passam por aqui — nos
 * mockups 03 eles usam a barra brand (MainLayout), que monta a 3ª linha do
 * breadcrumb com useSearchParams.
 *
 * Uso (dentro das rotas do App):
 *   <Route path="/projeto/:slug"
 *          element={<StackShell resolveTitle={projectTitle} fallback="Projeto" />}>
 */
import { useParams, useSearchParams } from 'react-router-dom';

import MainLayout from '../layout/MainLayout/MainLayout.jsx';

export default function StackShell({ resolveTitle, fallback = '' }) {
  const params = useParams();
  const [search] = useSearchParams();
  // resolveTitle é opcional: rotas sem ela (ex.: /painel/meu-projeto,
  // /painel/revisar/:slug) usam direto o fallback como título da barra.
  return (
    <MainLayout
      barVariant="stack"
      title={resolveTitle?.(params, search) ?? fallback}
    />
  );
}
