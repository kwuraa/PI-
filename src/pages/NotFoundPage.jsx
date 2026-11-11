/**
 * PI² — Página não encontrada (rota "*").
 * Estado vazio didático com atalhos de volta para os espaços principais.
 */
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import Logo from '../components/icons/Logo.jsx';
import Button from '../components/ui/Button/Button.jsx';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Logo size={72} />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Esta página não existe</h1>
      <p className={styles.text}>
        O endereço pode estar errado ou o conteúdo foi movido. Volte para a
        vitrine ou entre no seu espaço.
      </p>
      <div className={styles.actions}>
        <Button fullWidth size="lg" onClick={() => navigate('/')}>
          <FiArrowLeft aria-hidden="true" />
          Ir para a boas-vindas
        </Button>
        <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/explorar')}>
          Explorar projetos
        </Button>
      </div>
    </div>
  );
}
