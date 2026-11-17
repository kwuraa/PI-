/**
 * PI² — Explorar projetos (rota "/explorar").
 * -----------------------------------------------------------------------------
 * DOIS estados de tela, condicionais ao estado da busca/filtros:
 *  • PADRÃO (sem busca e sem filtros ativos) → protótipo "Explorar projetos":
 *    h1 "Ideias de todos. Inspiração para você." + saudação, campo de busca e
 *    botão "Filtrar projetos", pílulas de escopo (DSM · faixa de semestres),
 *    banner "CONHECIMENTO SEM FRONTEIRAS" e as seções "Em destaque"
 *    e "Novas descobertas" com cards;
 *  • RESULTADOS (busca e/ou filtros ativos, ou "Ver todos") → contagem de
 *    resultados, pílulas removíveis e grade.
 * FILTROS COM UMA ÚNICA SUPERFÍCIE: nos dois estados o mesmo botão
 * "Filtrar projetos" abre a mesma caixa de filtros (Modal) com chips de
 * Semestre, Tecnologia, Ordenar por e Status — sem painel lateral nem
 * atalhos duplicados. Visitantes veem apenas projetos PUBLICADOS e com
 * equipe anonimizada (LGPD); logados veem os nomes da equipe (variant
 * `logged`). Três projetos de exemplo trazem foto de capa no card
 * (imagem pública local em /img); os demais seguem sem capa. No banner de
 * descoberta usamos um bloco de cor/token.
 */
import { useMemo, useState } from 'react';
import { FiArrowDown, FiSliders, FiStar, FiX } from 'react-icons/fi';

import Button from '../components/ui/Button/Button.jsx';
import FilterChips from '../components/ui/FilterChips/FilterChips.jsx';
import Modal from '../components/ui/Modal/Modal.jsx';
import SearchField from '../components/ui/SearchField/SearchField.jsx';
import ProjectCard from '../components/public/ProjectCard/ProjectCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  COURSE_SHORT,
  PROJECTS,
  SEMESTERS,
  TECHNOLOGIES,
} from '../mocks/projectsMock.js';
import styles from './ExplorePage.module.css';

const TECH_OPTIONS = TECHNOLOGIES.map((tech) => ({ value: tech, label: tech }));
const STATUS_OPTIONS = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'em-analise', label: 'Em análise' },
  { value: 'publicado', label: 'Publicado' },
];
const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'salvos', label: 'Mais salvos' },
  { value: 'az', label: 'Título (A–Z)' },
];

/** Faixa de semestres do curso (pílula de escopo do estado padrão). */
const SEMESTER_RANGE = `${SEMESTERS[0]}º ao ${SEMESTERS[SEMESTERS.length - 1]}º semestre`;

export default function ExplorePage() {
  const { user } = useAuth();
  const isLogged = Boolean(user);

  const [query, setQuery] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [techs, setTechs] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [sort, setSort] = useState('recentes');
  const [filtersOpen, setFiltersOpen] = useState(false);
  /** "Ver todos" / "Mais recentes" ligam o estado de resultados sem filtro. */
  const [browsing, setBrowsing] = useState(false);

  /** Visitante só enxerga o que já foi publicado. */
  const visibleProjects = useMemo(
    () => (isLogged ? PROJECTS : PROJECTS.filter((p) => p.status === 'publicado')),
    [isLogged]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleProjects.filter((project) => {
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q));
      const matchesSemester =
        semesters.length === 0 || semesters.includes(project.semester);
      const matchesTech =
        techs.length === 0 || project.technologies.some((t) => techs.includes(t));
      const matchesStatus =
        statuses.length === 0 || statuses.includes(project.status);
      return matchesQuery && matchesSemester && matchesTech && matchesStatus;
    });
  }, [visibleProjects, query, semesters, techs, statuses]);

  /** Contagem de projetos visíveis por semestre (rótulos das chips de semestre). */
  const semesterCounts = useMemo(() => {
    const counts = {};
    visibleProjects.forEach((p) => {
      counts[p.semester] = (counts[p.semester] ?? 0) + 1;
    });
    return counts;
  }, [visibleProjects]);

  /** Chips de semestre com a contagem de cada um (o dado que o antigo painel lateral mostrava). */
  const semesterOptions = useMemo(
    () =>
      SEMESTERS.map((n) => ({
        value: n,
        label: `${n}º semestre (${semesterCounts[n] ?? 0})`,
      })),
    [semesterCounts]
  );

  /** Resultados reordenados conforme a caixa de filtros ("Ordenar por"). */
  const sorted = useMemo(() => {
    const list = [...results];
    if (sort === 'salvos') list.sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    return list;
  }, [results, sort]);

  /* --------------------------- seções do estado PADRÃO (mockup) */
  /** Só projetos publicados entram nas seções de descoberta. */
  const publishedProjects = useMemo(
    () => visibleProjects.filter((p) => p.status === 'publicado'),
    [visibleProjects]
  );

  /**
   * "Em destaque": o projeto publicado com destaque mais salvo
   * (1 card, como no protótipo "Explorar projetos").
   */
  const highlight = useMemo(() => {
    const featured = publishedProjects
      .filter((p) => p.featured)
      .sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
    return featured.length > 0 ? featured.slice(0, 1) : publishedProjects.slice(0, 1);
  }, [publishedProjects]);

  /**
   * "Novas descobertas": os demais publicados na ordem dos mocks
   * (Rota Acessível → Água em Foco, do mais recente para o mais antigo).
   */
  const discoveries = useMemo(() => {
    const ids = new Set(highlight.map((p) => p.id));
    return publishedProjects.filter((p) => !ids.has(p.id));
  }, [publishedProjects, highlight]);

  /** Busca digitada ou filtros escolhidos (sem "Ver todos"). */
  const hasQuery = query.trim().length > 0;
  const hasFilters = semesters.length > 0 || techs.length > 0 || statuses.length > 0;
  /** Estado de resultados ligado: busca, filtros ativos ou navegação explícita. */
  const showResults = hasQuery || hasFilters || browsing;

  const clearFilters = () => {
    setSemesters([]);
    setTechs([]);
    setStatuses([]);
    setQuery('');
    setBrowsing(false);
  };

  /** Rótulo do campo de ordenação (mockup: "8 projetos encontrados · Mais recentes"). */
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? 'Mais recentes';

  /** Saudação do estado padrão (mockup: "Olá, Ana. O que vamos descobrir?"). */
  const greeting = user ? `Olá, ${user.name.split(' ')[0]}` : 'Olá';

  /** Filtros ativos como pílulas removíveis acima da grade (mockup). */
  const activePills = [
    ...semesters.map((n) => ({
      key: `sem-${n}`,
      label: `${COURSE_SHORT} · ${n}º semestre`,
      primary: true,
      clear: () => setSemesters((prev) => prev.filter((v) => v !== n)),
    })),
    ...techs.map((tech) => ({
      key: `tech-${tech}`,
      label: tech,
      primary: false,
      clear: () => setTechs((prev) => prev.filter((v) => v !== tech)),
    })),
    ...statuses.map((status) => ({
      key: `st-${status}`,
      label: STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status,
      primary: false,
      clear: () => setStatuses((prev) => prev.filter((v) => v !== status)),
    })),
  ];

  /* --------------------------------------- busca + botão de filtros
     (IDÊNTICO nos dois estados: um só ponto de entrada para a caixa) */
  const searchRow = (
    <div className={styles.searchRow}>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Buscar projeto ou tecnologia"
      />
      <Button icon={<FiSliders aria-hidden="true" />} onClick={() => setFiltersOpen(true)}>
        Filtrar projetos
      </Button>
    </div>
  );

  /* --------------------------------------- card das seções do padrão */
  const renderSectionCards = (list) =>
    list.map((project, index) => (
      <ProjectCard
        key={project.id}
        project={project}
        variant={isLogged ? 'logged' : 'public'}
        index={index}
      />
    ));

  return (
    <div className={styles.page}>
      {/* -------- cabeçalho: título e subtítulo de cada estado -------- */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {showResults
            ? hasQuery
              ? `Projetos de ${query.trim()}`
              : 'Explorar projetos'
            : 'Ideias de todos. Inspiração para você.'}
        </h1>
        <p className={styles.pageSubtitle}>
          {showResults
            ? `${results.length} projeto${results.length === 1 ? '' : 's'} encontrado${
                results.length === 1 ? '' : 's'
              } · ${sortLabel}`
            : `${greeting}. O que vamos descobrir?`}
        </p>
      </header>

      {showResults ? (
        /* --------------------------- resultados: busca + pílulas + grade */
        <div className={styles.content}>
          {searchRow}

          {activePills.length > 0 && (
            <div className={styles.pills}>
              {activePills.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  className={`${styles.pill} ${pill.primary ? styles.pillPrimary : ''}`}
                  onClick={pill.clear}
                  aria-label={`Remover filtro ${pill.label}`}
                >
                  {pill.label}
                  <FiX size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          <div className={styles.grid} id="resultados">
            {sorted.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant={isLogged ? 'logged' : 'public'}
                index={index}
              />
            ))}
          </div>

          {results.length === 0 && (
            <p className={styles.empty}>
              Nenhum projeto com esses critérios. Ajuste a busca ou remova os filtros.
            </p>
          )}
        </div>
      ) : (
        /* ------------------------- estado PADRÃO (sem busca/filtros) */
        <>
          {searchRow}

          {/* escopo fixo (só informativo): filtros apenas pelo botão acima */}
          <div className={styles.pills}>
            <span className={`${styles.pill} ${styles.pillPrimary}`}>{COURSE_SHORT}</span>
            <span className={styles.pill}>{SEMESTER_RANGE}</span>
          </div>

          {/* banner de descoberta (foto fora de escopo → bloco de cor/token) */}
          <section className={styles.banner} aria-labelledby="banner-descoberta">
            <div className={styles.bannerTexts}>
              <span className={styles.bannerEyebrow}>CONHECIMENTO SEM FRONTEIRAS</span>
              <h2 className={styles.bannerTitle} id="banner-descoberta">
                Seu próximo projeto pode começar com uma descoberta.
              </h2>
              <p className={styles.bannerMeta}>
                Projetos {COURSE_SHORT} · {SEMESTERS.length} semestres · muitas conexões
              </p>
            </div>
            <div className={styles.bannerArt} aria-hidden="true">
              <FiStar />
            </div>
          </section>

          {publishedProjects.length === 0 && (
            <p className={styles.empty}>
              Nenhum projeto publicado por enquanto. Volte em breve para novas descobertas.
            </p>
          )}

          <div className={styles.sections}>
            <section className={styles.section} aria-labelledby="sec-destaque">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle} id="sec-destaque">
                  Em destaque
                </h2>
                <button
                  type="button"
                  className={styles.sectionLink}
                  onClick={() => setBrowsing(true)}
                >
                  Ver todos
                </button>
              </div>
              <div className={styles.sectionCards}>{renderSectionCards(highlight)}</div>
            </section>

            <section className={styles.section} aria-labelledby="sec-novas">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle} id="sec-novas">
                  Novas descobertas
                </h2>
                <button
                  type="button"
                  className={styles.sectionLink}
                  onClick={() => {
                    setSort('recentes');
                    setBrowsing(true);
                  }}
                >
                  Mais recentes
                  <FiArrowDown size={14} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.sectionCards}>{renderSectionCards(discoveries)}</div>
            </section>
          </div>
        </>
      )}

      {/* ------- caixa ÚNICA de filtros (desktop: diálogo; mobile: sheet) */}
      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        footer={
          <div className={styles.sheetFooter}>
            <Button variant="secondary" onClick={clearFilters}>
              Limpar
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>
              Ver resultados
              <FiSliders aria-hidden="true" />
            </Button>
          </div>
        }
      >
        <div className={styles.sheetBody}>
          <section className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Semestre</h3>
            <FilterChips
              options={semesterOptions}
              value={semesters}
              onChange={setSemesters}
              multiple
              clearLabel="Todos"
            />
          </section>

          <section className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Tecnologia</h3>
            <FilterChips
              options={TECH_OPTIONS}
              value={techs}
              onChange={setTechs}
              multiple
              clearLabel="Todas"
            />
          </section>

          <section className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Ordenar por</h3>
            {/* ordem é obrigatória → sem chip "limpar": ele teria o MESMO
                rótulo "Mais recentes" da primeira opção (chip duplicado) */}
            <FilterChips
              options={SORT_OPTIONS}
              value={sort}
              onChange={(next) => setSort(next ?? 'recentes')}
              clearLabel={null}
            />
          </section>

          {isLogged && (
            <section className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Status</h3>
              <FilterChips
                options={STATUS_OPTIONS}
                value={statuses}
                onChange={setStatuses}
                multiple
                clearLabel="Todos"
              />
            </section>
          )}
        </div>
      </Modal>
    </div>
  );
}
