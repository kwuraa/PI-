import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';

import LegalPage from '../../components/public/LegalPage/LegalPage.jsx';

/** Seções do documento (mock — sem backend). */
const SECTIONS = [
  {
    id: 'aceite',
    title: '1. Aceitação dos termos',
    paragraphs: [
      'Ao criar uma conta ou navegar pelo PI², você concorda com estes Termos de uso. Se não concordar, não utilize a plataforma.',
      'Estes termos podem ser atualizados a qualquer momento. A versão sempre válida é a publicada nesta página.',
    ],
  },
  {
    id: 'conta',
    title: '2. Conta institucional',
    paragraphs: [
      'O acesso é exclusivo para a comunidade acadêmica, mediante e-mail institucional. Você é responsável por manter suas credenciais em sigilo e por toda atividade realizada na sua conta.',
      'Contas são pessoais e intransferíveis. Em caso de uso indevido, procure o suporte da faculdade.',
    ],
  },
  {
    id: 'uso',
    title: '3. Uso aceitável',
    paragraphs: [
      'Você se compromete a usar a plataforma de forma lícita e respeitosa: é proibido publicar conteúdo ofensivo, plágio, tentativas de invasão, spam ou qualquer atividade que comprometa a segurança do PI².',
    ],
  },
  {
    id: 'projetos',
    title: '4. Projetos e propriedade intelectual',
    paragraphs: [
      'Os projetos publicados são de propriedade das equipes que os criaram. Ao enviar um projeto, você mantém seus direitos de autoria e concede ao PI² a licença de exibi-lo na vitrine pública.',
      'Na vitrine, a autoria é sempre creditada à equipe, em conformidade com a LGPD.',
    ],
  },
  {
    id: 'moderacao',
    title: '5. Moderação e publicação',
    paragraphs: [
      'Todo projeto passa por análise do orientador antes de ser publicado. A coordenação pode remover conteúdo que viole estes termos ou a legislação vigente.',
    ],
  },
  {
    id: 'lgpd',
    title: '6. Privacidade e LGPD',
    paragraphs: [
      <>
        O tratamento dos seus dados segue a Lei Geral de Proteção de Dados
        (LGPD). Saiba como coletamos e usamos suas informações na nossa{' '}
        <Link to="/privacidade">Política de privacidade</Link>.
      </>,
    ],
  },
  {
    id: 'contato',
    title: '7. Contato',
    paragraphs: [
      'Dúvidas sobre estes termos? Fale com o suporte institucional em suporte@faculdade.edu.br ou visite a página de ajuda.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      icon={<FiFileText size={26} aria-hidden="true" />}
      topTitle="Termos de uso"
      title="Termos de uso do PI²."
      subtitle="As regras de convivência e uso do repositório acadêmico da comunidade DSM."
      updated="23 de novembro de 2026"
      sections={SECTIONS}
      backTo="/"
    />
  );
}
