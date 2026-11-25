/**
 * PI² — Estado vazio "entrega não encontrada" (rota /painel/entrega/:slug).
 * -----------------------------------------------------------------------------
 * Extraído de DeliveryPage.jsx na separação "um componente por arquivo" (item 6).
 * Aparece quando o slug da URL não corresponde a nenhuma entrega mockada.
 * Não tem estilos próprios: usa só os componentes de UI (Callout + Button).
 *
 * Uso (dentro da DeliveryPage):
 *   <CalloutNotFound />
 */
import { Link } from 'react-router-dom';

import Button from '../ui/Button/Button.jsx';
import Callout from '../ui/Callout/Callout.jsx';

export default function CalloutNotFound() {
  return (
    <Callout
      tone="danger"
      title="Entrega não encontrada"
      action={
        <Link to="/painel">
          <Button>Voltar ao painel</Button>
        </Link>
      }
    >
      Nenhuma entrega corresponde a este endereço.
    </Callout>
  );
}
