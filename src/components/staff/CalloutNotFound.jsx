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
