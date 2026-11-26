import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

import LegalPage from '../../components/public/LegalPage/LegalPage.jsx';

/** Seções do documento (mock — sem backend). */
const SECTIONS = [
  {
    id: 'dados',
    title: '1. Dados que coletamos',
    paragraphs: [
      'Coletamos os dados da sua conta institucional (nome, e-mail, curso e papel) informados no cadastro, além dos dados dos projetos que você envia e das interações com a vitrine (visualizações e curtidas).',
      'A vitrine pública não exibe dados pessoais dos estudantes: a autoria aparece apenas como equipe.',
    ],
  },
  {
    id: 'finalidade',
    title: '2. Para que usamos seus dados',
    paragraphs: [
      'Usamos seus dados para autenticar seu acesso, exibir os projetos da comunidade, enviar notificações sobre análises e melhorar a experiência do PI².',
    ],
  },
  {
    id: 'base-legal',
    title: '3. Base legal',
    paragraphs: [
      'O tratamento acontece com base no consentimento do titular e na execução do contrato acadêmico, conforme a Lei Geral de Proteção de Dados (LGPD).',
    ],
  },
  {
    id: 'compartilhamento',
    title: '4. Compartilhamento',
    paragraphs: [
      'Seus dados não são vendidos. Eles são acessados apenas pela equipe acadêmica envolvida nas análises e pela coordenação do curso, sempre dentro das finalidades descritas aqui.',
    ],
  },
  {
    id: 'retencao',
    title: '5. Retenção e segurança',
    paragraphs: [
      'Os dados são mantidos enquanto sua conta estiver ativa e por prazos exigidos pela instituição. Adotamos medidas de acesso e proteção adequadas para reduzir riscos.',
    ],
  },
  {
    id: 'direitos',
    title: '6. Seus direitos',
    paragraphs: [
      'Você pode solicitar confirmação de tratamento, acesso, correção, anonimização ou eliminação dos seus dados, além de revogar o consentimento.',
      'Para exercer esses direitos, fale com o suporte em suporte@faculdade.edu.br. Mais detalhes sobre o uso da plataforma estão nos nossos Termos de uso.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      icon={<FiShield size={26} aria-hidden="true" />}
      topTitle="Política de privacidade"
      title="Sua privacidade no PI²."
      subtitle="Como coletamos, usamos e protegemos seus dados — em conformidade com a LGPD."
      updated="23 de novembro de 2026"
      sections={SECTIONS}
      backTo="/"
    >
      {/* link cruzado de volta para os termos */}
      <p>
        Dúvidas sobre as regras da plataforma? Veja os{' '}
        <Link to="/termos">Termos de uso</Link>.
      </p>
    </LegalPage>
  );
}
