/**
 * PI² — Boas-Vindas / Vitrine Pública (rota "/").
 * -----------------------------------------------------------------------------
 * Hero em 2 colunas (protótipo desktop): eyebrow "VITRINE PÚBLICA DA
 * COMUNIDADE", título "Grandes ideias. Conhecimento que transforma." à
 * esquerda; lead + CTAs ("Entrar no Sistema" / "Ver Projetos") à direita.
 * Abaixo: seção "Explore os projetos DSM" (busca + chips rotulados),
 * banner LGPD e a grade "Projetos da comunidade" com cards ANONIMIZADOS
 * (variante "vitrine": pílula do semestre + crédito da equipe).
 * Movimento: hero em stagger (framer-motion) e cards em cascata.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import SearchField from '../../components/ui/SearchField/SearchField.jsx';
import ProjectCard from '../../components/public/ProjectCard/ProjectCard.jsx';
import { COURSE_SHORT, PROJECTS, SEMESTERS } from '../../mocks/projectsMock.js';
import { fadeUpChild, staggerParent } from '../../styles/motion.js';
import styles from './WelcomePage.module.css';

/** Opções do chip de semestre: "1º DSM"…"6º DSM" (como no protótipo). */
const SEMESTER_OPTIONS = SEMESTERS.map((n) => ({ value: n, label: `${n}º DSM` }));

export default function WelcomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [semester, setSemester] = useState(null);

  /** Só projetos PUBLICADOS entram na vitrine (visitante não vê rascunhos). */
  const published = useMemo(() => PROJECTS.filter((p) => p.status === 'publicado'), []);

  /** Busca por palavra-chave em título, descrição e tecnologias. */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return published.filter((project) => {
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q));
      const matchesSemester = semester === null || project.semester === semester;
      return matchesQuery && matchesSemester;
    });
  }, [published, query, semester]);

  /** CTA secundário: rola suavemente até a grade de projetos. */
  const scrollToVitrine = () => {
    document.getElementById('vitrine')?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className={styles.page}>
      {/* cabeçalho da vitrine — só aparece no desktop (≥1024px) */}
      <div className={styles.brandBar}>
        <Logo size={56} />
        <span className={styles.brandBarLabel}>Conhecimento conectado</span>
      </div>

      {/* ------------------------------------------------------- hero */}
      <motion.header
        className={styles.hero}
        variants={staggerParent}
        initial="hidden"
        animate="show"
      >
        <motion.div className={styles.logoCard} variants={fadeUpChild}>
          <Logo size={148} />
        </motion.div>

        <motion.p className={styles.eyebrow} variants={fadeUpChild}>
          Vitrine pública da comunidade
        </motion.p>
        <motion.h1 className={styles.headline} variants={fadeUpChild}>
          Grandes ideias.
          <br />
          Conhecimento que transforma.
        </motion.h1>
        <motion.p className={styles.lead} variants={fadeUpChild}>
          Conheça os Projetos Integradores de Desenvolvimento de Software
          Multiplataforma (DSM). Explore ideias e soluções criadas em nossa
          comunidade acadêmica.
        </motion.p>

        <motion.div className={styles.actions} variants={fadeUpChild}>
          <Button
            fullWidth
            size="lg"
            icon={<FiArrowRight aria-hidden="true" />}
            onClick={() => navigate('/login')}
          >
            Entrar no Sistema
          </Button>
          <Button fullWidth size="lg" variant="secondary" onClick={scrollToVitrine}>
            Ver Projetos
          </Button>
        </motion.div>
      </motion.header>

      {/* ------------------------------------------- filtros + vitrine */}
      <div className={styles.showcase}>
        <section className={styles.filters} aria-labelledby="filtros-title">
          <h2 className={styles.sectionTitle} id="filtros-title">
            Explore os projetos {COURSE_SHORT}
          </h2>
          <div className={styles.filtersRow}>
            <div className={styles.filterField}>
              <span className={styles.filterLabel}>Nome do projeto ou tecnologia</span>
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Buscar por projeto, React, Python…"
              />
            </div>
            <div className={styles.filterField}>
              <span className={styles.filterLabel}>Semestre {COURSE_SHORT}</span>
              <FilterChips
                options={SEMESTER_OPTIONS}
                value={semester}
                onChange={setSemester}
                clearLabel="Todos os semestres"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------- banner LGPD */}
        <aside className={styles.lgpd}>
          <FiShield className={styles.lgpdIcon} aria-hidden="true" />
          <div className={styles.lgpdTexts}>
            <strong>Conhecimento aberto. Dados protegidos.</strong>
            <p>
              Nesta vitrine, a autoria é sempre da equipe. Dados pessoais dos
              estudantes não são exibidos, em respeito à LGPD.
            </p>
          </div>
        </aside>

        {/* ------------------------------------------- resultados */}
        <section className={styles.vitrine} id="vitrine" aria-labelledby="vitrine-title">
          <h2 className={styles.sectionTitle} id="vitrine-title">
            Projetos da comunidade
          </h2>

          <div className={styles.grid}>
            {results.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="vitrine"
                index={index}
              />
            ))}
          </div>

          {results.length === 0 && (
            <p className={styles.empty}>
              Nenhum projeto encontrado com esses filtros. Tente outra busca.
            </p>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerSlogan}>
          PI² · Ideias que multiplicam conhecimento
        </span>
        <nav className={styles.footerLinks} aria-label="Links institucionais">
          <a href="#instituicao">Instituição</a>
          <a href="#termos">Termos de uso</a>
          <a href="#privacidade">Privacidade</a>
        </nav>
        <Link className={styles.footerAdmin} to="/login">
          <FiShield aria-hidden="true" />
          Login administrativo
        </Link>
      </footer>
    </div>
  );
}
