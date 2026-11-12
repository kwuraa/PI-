/**
 * PI² — Página de Ajuda e suporte (rota "/ajuda").
 *
 * Central de dúvidas do protótipo, renderizada dentro do MainLayout
 * (TopBar, sidebar, breadcrumb e rodapé já vêm do layout):
 *  1. Badge/eyebrow "Ajuda e suporte" + h1 + subtítulo (padrão das páginas);
 *  2. Seção "Fale com o suporte": 2 cards de contato em grade responsiva;
 *  3. Seção "Perguntas frequentes": 4 itens <details>/<summary> nativos,
 *     que abrem e fecham sem JavaScript (o navegador cuida disso);
 *  4. Link final de volta à vitrine pública ("/explorar").
 *
 * Regras do projeto: estilo SEMPRE em CSS Module (nunca estilo inline),
 * cores SOMENTE via variáveis CSS (nunca hex) e ícones apenas de react-icons/fi.
 */
import { Link } from 'react-router-dom';
import { FiMail, FiMessageCircle, FiChevronDown } from 'react-icons/fi';

import styles from './HelpPage.module.css';

export default function HelpPage() {
  return (
    <div className={styles.page}>
      {/* ---------- cabeçalho da página (badge + h1 + subtítulo) ---------- */}
      <header className={styles.header}>
        <span className={styles.badge}>Ajuda e suporte</span>
        <h1 className={styles.title}>Como podemos ajudar?</h1>
        <p className={styles.subtitle}>
          Respostas rápidas sobre acesso, publicação e privacidade no PI².
        </p>
      </header>

      {/* ---------- seção 1: canais de atendimento ---------- */}
      <section className={styles.section} aria-labelledby="ajuda-suporte">
        <h2 id="ajuda-suporte" className={styles.sectionTitle}>
          Fale com o suporte
        </h2>

        <div className={styles.contactGrid}>
          <article className={styles.contactCard}>
            <span className={styles.contactIcon}>
              <FiMail aria-hidden="true" />
            </span>
            <div className={styles.contactTexts}>
              <h3 className={styles.contactTitle}>Suporte institucional</h3>
              <a
                className={styles.contactLink}
                href="mailto:suporte@faculdade.edu.br"
              >
                suporte@faculdade.edu.br
              </a>
              <p className={styles.contactMeta}>Seg a sex · das 8h às 18h</p>
            </div>
          </article>

          <article className={styles.contactCard}>
            <span className={styles.contactIcon}>
              <FiMessageCircle aria-hidden="true" />
            </span>
            <div className={styles.contactTexts}>
              <h3 className={styles.contactTitle}>Orientação acadêmica</h3>
              <p className={styles.contactBody}>
                Fale com seu orientador pelo painel do PI².
              </p>
              <p className={styles.contactMeta}>
                Atendimento durante o semestre letivo.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ---------- seção 2: FAQ em <details> nativos ---------- */}
      <section className={styles.section} aria-labelledby="ajuda-faq">
        <h2 id="ajuda-faq" className={styles.sectionTitle}>
          Perguntas frequentes
        </h2>

        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Como faço meu login no PI²?
              <FiChevronDown className={styles.faqChevron} aria-hidden="true" />
            </summary>
            <p className={styles.faqAnswer}>
              Escolha o seu perfil (aluno, professor, coordenador ou secretaria)
              na tela de acesso e entre com o e-mail institucional. O protótipo
              não valida senha.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Esqueci minha senha.
              <FiChevronDown className={styles.faqChevron} aria-hidden="true" />
            </summary>
            <p className={styles.faqAnswer}>
              Solicite a recuperação pelo e-mail institucional.{' '}
              <Link to="/recuperar-senha" className={styles.faqLink}>
                Recuperar acesso
              </Link>
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Quem pode ver o meu projeto?
              <FiChevronDown className={styles.faqChevron} aria-hidden="true" />
            </summary>
            <p className={styles.faqAnswer}>
              Na vitrine pública a autoria aparece apenas como equipe (LGPD).
              Nomes completos ficam visíveis só para a comunidade logada.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Como publico um projeto?
              <FiChevronDown className={styles.faqChevron} aria-hidden="true" />
            </summary>
            <p className={styles.faqAnswer}>
              Preencha os dados em Meus projetos → Novo projeto e clique em
              Enviar para análise. O orientador revisa e o projeto só fica
              público após a aprovação.
            </p>
          </details>
        </div>
      </section>

      {/* ---------- atalho de volta à vitrine pública ---------- */}
      <Link to="/explorar" className={styles.backLink}>
        Voltar para a exploração de projetos
      </Link>
    </div>
  );
}
