/**
 * PI² — Boas-Vindas / Vitrine Pública (rota "/").
 * -----------------------------------------------------------------------------
 * Hero do protótipo "Boas-vindas ao PI²" + vitrine exigida pelo briefing:
 * busca por palavra-chave, filtro de semestre (1º ao 6º) e grade de cards
 * ANONIMIZADOS (LGPD: só "Equipe DSM — Xº Semestre").
 * Visitante não logado → ações levam ao login/cadastro.
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers } from 'react-icons/fi';

import Logo from '../../components/icons/Logo.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import SearchField from '../../components/ui/SearchField/SearchField.jsx';
import ProjectCard from '../../components/public/ProjectCard/ProjectCard.jsx';
import { COURSE_SHORT, PROJECTS, SEMESTERS } from '../../mocks/projectsMock.js';
import styles from './WelcomePage.module.css';

/** Opções do chip de semestre: "1º"…"6º". */
const SEMESTER_OPTIONS = SEMESTERS.map((n) => ({ value: n, label: `${n}º` }));

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

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------------- hero */}
      <header className={styles.hero}>
        <div className={styles.logoCard}>
          <Logo size={148} />
        </div>

        <p className={styles.eyebrow}>Repositório acadêmico</p>
        <h1 className={styles.headline}>
          Grandes ideias.
          <br />
          Conhecimento que se conecta.
        </h1>
        <p className={styles.lead}>
          Projetos de todos os cursos em um só lugar. Compartilhe descobertas e
          construa o futuro da nossa faculdade.
        </p>

        <div className={styles.proof}>
          <span className={styles.proofIcon}>
            <FiUsers aria-hidden="true" />
          </span>
          <div>
            <strong>Feito por alunos. Conectado a professores.</strong>
            <span>Da primeira ideia ao projeto publicado.</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            fullWidth
            size="lg"
            iconAfter={<FiArrowRight aria-hidden="true" />}
            onClick={() => navigate('/login')}
          >
            Entrar no PI²
          </Button>
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/cadastro')}>
            Criar minha conta
          </Button>
        </div>

        <p className={styles.hint}>Seu e-mail institucional é a porta de entrada.</p>
      </header>

      {/* --------------------------------------------------- vitrine */}
      <section className={styles.vitrine} id="vitrine" aria-labelledby="vitrine-title">
        <div className={styles.vitrineHeader}>
          <h2 className={styles.vitrineTitle} id="vitrine-title">
            Vitrine do {COURSE_SHORT}
          </h2>
          <p className={styles.vitrineSubtitle}>
            Descubra o que os alunos estão construindo. Em exibição: {results.length}{' '}
            projeto{results.length === 1 ? '' : 's'}.
          </p>
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Buscar por projeto ou tecnologia…"
        />

        <FilterChips
          options={SEMESTER_OPTIONS}
          value={semester}
          onChange={setSemester}
          clearLabel="Todos os semestres"
        />

        <div className={styles.grid}>
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} variant="public" />
          ))}
        </div>

        {results.length === 0 && (
          <p className={styles.empty}>
            Nenhum projeto encontrado com esses filtros. Tente outra busca.
          </p>
        )}
      </section>

      <footer className={styles.footer}>PI² · Ideias que multiplicam conhecimento</footer>
    </div>
  );
}
