/**
 * PI² — Explorar projetos (rota "/explorar").
 * -----------------------------------------------------------------------------
 * Busca por palavra-chave + filtros (semestre, tecnologia e, na área logada,
 * status) + ordenação dos resultados. No mobile os filtros abrem em bottom
 * sheet; no desktop (≥1024px) viram um painel fixo à esquerda com contagem
 * por semestre (protótipo "Resultados e painel de filtros").
 * Visitantes veem apenas projetos PUBLICADOS e com equipe anonimizada
 * (LGPD); usuários logados veem a visão completa.
 */
import { useMemo, useState } from 'react';
import { FiSliders } from 'react-icons/fi';

import Button from '../components/ui/Button/Button.jsx';
import FilterChips from '../components/ui/FilterChips/FilterChips.jsx';
import Modal from '../components/ui/Modal/Modal.jsx';
import SearchField from '../components/ui/SearchField/SearchField.jsx';
import SectionHeader from '../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../components/ui/Select/Select.jsx';
import ProjectCard from '../components/public/ProjectCard/ProjectCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  COURSE_SHORT,
  PROJECTS,
  SEMESTERS,
  TECHNOLOGIES,
} from '../mocks/projectsMock.js';
import styles from './ExplorePage.module.css';

const SEMESTER_OPTIONS = SEMESTERS.map((n) => ({ value: n, label: `${n}º semestre` }));
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

export default function ExplorePage() {
  const { user } = useAuth();
  const isLogged = Boolean(user);

  const [query, setQuery] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [techs, setTechs] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [sort, setSort] = useState('recentes');
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  /** Contagem de projetos visíveis por semestre (rótulos do painel). */
  const semesterCounts = useMemo(() => {
    const counts = {};
    visibleProjects.forEach((p) => {
      counts[p.semester] = (counts[p.semester] ?? 0) + 1;
    });
    return counts;
  }, [visibleProjects]);

  /** Resultados reordenados conforme o painel ("Ordenar por"). */
  const sorted = useMemo(() => {
    const list = [...results];
    if (sort === 'salvos') list.sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    return list;
  }, [results, sort]);

  const clearFilters = () => {
    setSemesters([]);
    setTechs([]);
    setStatuses([]);
    setQuery('');
  };

  const hasFilters =
    semesters.length > 0 || techs.length > 0 || statuses.length > 0 || query !== '';

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Explorar projetos"
        subtitle={
          isLogged
            ? 'Busque, filtre e descubra o que está sendo construído no DSM.'
            : 'Projetos publicados do DSM. A equipe aparece de forma anônima (LGPD).'
        }
      />

      <div className={styles.layout}>
        {/* ------------------------- painel lateral (só desktop) */}
        <aside className={styles.panel} aria-label="Filtrar projetos">
          <h2 className={styles.panelTitle}>Filtrar projetos</h2>

          <section className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Semestre · {COURSE_SHORT}</h3>
            <div className={styles.radioList} role="radiogroup" aria-label="Semestre">
              <button
                type="button"
                role="radio"
                aria-checked={semesters.length === 0}
                className={`${styles.radioRow} ${
                  semesters.length === 0 ? styles.radioActive : ''
                }`}
                onClick={() => setSemesters([])}
              >
                <span className={styles.radioDot} aria-hidden="true" />
                Todos os semestres
                <span className={styles.radioCount}>{visibleProjects.length}</span>
              </button>
              {SEMESTERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={semesters.length === 1 && semesters[0] === n}
                  className={`${styles.radioRow} ${
                    semesters.length === 1 && semesters[0] === n ? styles.radioActive : ''
                  }`}
                  onClick={() => setSemesters([n])}
                >
                  <span className={styles.radioDot} aria-hidden="true" />
                  {n}º semestre
                  <span className={styles.radioCount}>{semesterCounts[n] ?? 0}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Ordenar por</h3>
            <Select
              aria-label="Ordenar por"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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

          <button type="button" className={styles.clearPanel} onClick={clearFilters}>
            Limpar filtros
          </button>
        </aside>

        {/* --------------------------- resultados (conteúdo) */}
        <div className={styles.content}>
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Buscar por projeto ou tecnologia…"
            onFilterClick={() => setFiltersOpen(true)}
          />

          <div className={styles.chipsRow}>
            <FilterChips
              options={SEMESTER_OPTIONS}
              value={semesters.length === 1 ? semesters[0] : null}
              onChange={(v) => setSemesters(v === null ? [] : [v])}
              clearLabel="Todos os semestres"
            />
          </div>

          <p className={styles.count} aria-live="polite">
            {results.length} projeto{results.length === 1 ? '' : 's'} encontrado
            {results.length === 1 ? '' : 's'}
            {hasFilters && (
              <button type="button" className={styles.clear} onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </p>

          <div className={styles.grid}>
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
      </div>

      {/* --------------------------------------- bottom sheet (mobile) */}
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
              options={SEMESTER_OPTIONS}
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
            <FilterChips
              options={SORT_OPTIONS}
              value={sort}
              onChange={setSort}
              clearLabel="Mais recentes"
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
