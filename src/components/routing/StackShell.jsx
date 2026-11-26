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
