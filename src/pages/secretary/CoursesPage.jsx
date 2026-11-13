/**
 * PI² — Cadastro de Cursos da instituição (rota "/secretaria/cursos", secretaria).
 * -----------------------------------------------------------------------------
 * Tela institucional de cursos, com quatro blocos:
 *  1. Cabeçalho (badge "Gestão institucional" + h1 + lead) com o botão
 *     "+ Cadastrar novo curso", que abre o modal de cadastro (simulado);
 *  2. Coluna esquerda: título "Cursos cadastrados" + link "Todos", lista de
 *     cards (código grande, nome completo, meta e rodapé com "Editar curso"
 *     — abre o painel lateral — e "Desativar" — alterna o estado visual do
 *     card, sem backend) e o card rosa "Disponibilidade no MVP" (FiShield);
 *  3. Coluna direita (desktop ≥1024px; abaixo da lista no mobile): painel
 *     "Editar curso" com selo "<SIGLA> selecionado", campos "Sigla *" e
 *     "Nome do curso *", bloco "Curso ativo" com switch e os botões
 *     "Salvar alterações" (aplica na lista) e "Cancelar edição" (limpa a
 *     seleção);
 *  4. Modal de cadastro de novos cursos (mantido do protótipo original).
 * Todo o estado é local (useState) — protótipo sem backend.
 *
 * Regras do projeto: estilo SEMPRE em CSS Module (nunca estilo inline),
 * cores SOMENTE via variáveis CSS (nunca hex) e ícones apenas de react-icons/fi.
 */
import { useState } from 'react';
import { FiCheck, FiEdit2, FiPlus, FiShield } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE_SHORT } from '../../mocks/projectsMock.js';
import styles from './CoursesPage.module.css';

/**
 * Nome completo do DSM exibido NESTA tela.
 * O mock de dados (COURSE em projectsMock.js) traz "DSM · Desenvolvimento
 * de Software", mas o mockup da tela define "Desenvolvimento de Software
 * Multiplataforma" — divergência resolvida só na exibição, sem tocar no mock.
 */
const DSM_FULL_NAME = 'Desenvolvimento de Software Multiplataforma';

/** Cursos iniciais (mock DSM-only). */
const INITIAL_COURSES = [
  {
    id: 'curs-dsm',
    code: COURSE_SHORT,
    name: DSM_FULL_NAME,
    shift: 'Integral',
    status: 'ativo',
    meta: 'Disponível no cadastro de contas e na vitrine.',
  },
];

/** Estado vazio do formulário do painel de edição. */
const EMPTY_EDIT = { code: '', name: '', active: true };

export default function CoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', shift: 'Noturno' });

  /* ------------------------------------------------- edição lateral */
  /** Id do curso selecionado no painel (null = painel fechado). */
  const [selectedId, setSelectedId] = useState(INITIAL_COURSES[0].id);
  /** Rascunho editável do painel (preenchido ao clicar em "Editar curso"). */
  const [edit, setEdit] = useState({
    code: INITIAL_COURSES[0].code,
    name: INITIAL_COURSES[0].name,
    active: INITIAL_COURSES[0].status === 'ativo',
  });

  const selectedCourse = courses.find((course) => course.id === selectedId) ?? null;

  /** Abre o painel preenchido com os dados do card clicado. */
  const openEdit = (course) => {
    setSelectedId(course.id);
    setEdit({
      code: course.code,
      name: course.name,
      active: course.status === 'ativo',
    });
  };

  /** "Cancelar edição": limpa a seleção e fecha o painel. */
  const cancelEdit = () => {
    setSelectedId(null);
    setEdit(EMPTY_EDIT);
  };

  /** "Salvar alterações": aplica sigla, nome e status na lista (estado). */
  const saveEdit = (event) => {
    event.preventDefault();
    const code = edit.code.trim();
    const name = edit.name.trim();
    if (!code || !name || !selectedId) return;
    setCourses((prev) =>
      prev.map((course) =>
        course.id === selectedId
          ? {
              ...course,
              code: code.toUpperCase(),
              name,
              status: edit.active ? 'ativo' : 'inativo',
            }
          : course,
      ),
    );
  };

  /** "Desativar"/"Ativar": alterna o estado visual do card (sem backend). */
  const toggleStatus = (course) => {
    const next = course.status === 'ativo' ? 'inativo' : 'ativo';
    setCourses((prev) =>
      prev.map((item) =>
        item.id === course.id ? { ...item, status: next } : item,
      ),
    );
    // mantém o rascunho do painel em sincronia, se o curso estiver selecionado
    if (course.id === selectedId) {
      setEdit((prev) => ({ ...prev, active: next === 'ativo' }));
    }
  };

  /* ------------------------------------------- cadastro (modal) */
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const code = form.code.trim();
    if (!name || !code) return;
    setCourses((prev) => [
      ...prev,
      {
        id: `curs-${prev.length + 1}`,
        name,
        code: code.toUpperCase(),
        shift: form.shift,
        status: 'ativo',
        meta: `Cadastro da secretaria · Turno ${form.shift}`,
      },
    ]);
    setForm({ name: '', code: '', shift: 'Noturno' });
    setOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* ------------------- cabeçalho (badge + h1 + lead + ação) */}
      <header className={styles.header}>
        <div className={styles.headerTexts}>
          <span className={styles.eyebrow}>Gestão institucional</span>
          <h1 className={styles.title}>Cadastro de Cursos</h1>
          <p className={styles.lead}>
            Gerencie os cursos ativos da instituição e mantenha os dados do
            cadastro atualizados.
          </p>
        </div>
        <button
          type="button"
          className={styles.newButton}
          onClick={() => setOpen(true)}
        >
          <FiPlus aria-hidden="true" />
          Cadastrar novo curso
        </button>
      </header>

      {/* ------------- conteúdo: lista (esq.) + painel (dir.) */}
      <div className={styles.content}>
        <div className={styles.listColumn}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Cursos cadastrados</h2>
            <button type="button" className={styles.allLink}>
              Todos
            </button>
          </div>

          <div className={styles.list}>
            {courses.map((course) => {
              const inactive = course.status !== 'ativo';
              return (
                <Card
                  key={course.id}
                  padding="lg"
                  className={`${styles.card} ${inactive ? styles.cardInactive : ''}`}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.code}>{course.code}</span>
                    <Badge tone={inactive ? 'neutral' : 'success'}>
                      {inactive ? 'Inativo' : 'Ativo'}
                    </Badge>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.name}>{course.name}</h3>
                    <p className={styles.meta}>{course.meta}</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.editAction}
                      onClick={() => openEdit(course)}
                    >
                      <FiEdit2 aria-hidden="true" />
                      Editar curso
                    </button>
                    <button
                      type="button"
                      className={styles.deactivateAction}
                      onClick={() => toggleStatus(course)}
                    >
                      {inactive ? 'Ativar' : 'Desativar'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* --------------- card rosa: disponibilidade no MVP */}
          <aside className={styles.mvpCard}>
            <span className={styles.mvpIcon}>
              <FiShield aria-hidden="true" />
            </span>
            <div className={styles.mvpTexts}>
              <h3 className={styles.mvpTitle}>Disponibilidade no MVP</h3>
              <p className={styles.mvpText}>
                Somente DSM está disponível no cadastro de contas e na vitrine
                pública. O registro administrativo de outros cursos não os
                disponibiliza nesses espaços.
              </p>
            </div>
          </aside>
        </div>

        {/* ---------------------- painel lateral de edição */}
        {selectedCourse && (
          <aside className={styles.panel} aria-label="Painel de edição de curso">
            <div className={styles.panelTop}>
              <h2 className={styles.panelTitle}>Editar curso</h2>
              <Badge tone="primary">{selectedCourse.code} selecionado</Badge>
            </div>
            <p className={styles.panelLead}>
              Atualize os dados abaixo. Os campos com * são obrigatórios.
            </p>

            <form className={styles.form} onSubmit={saveEdit}>
              <TextField
                label="Sigla"
                required
                id="curso-editar-sigla"
                value={edit.code}
                onChange={(e) =>
                  setEdit((f) => ({ ...f, code: e.target.value }))
                }
                placeholder="Ex.: DSM"
              />
              <TextField
                label="Nome do curso"
                required
                id="curso-editar-nome"
                value={edit.name}
                onChange={(e) =>
                  setEdit((f) => ({ ...f, name: e.target.value }))
                }
                placeholder={`Ex.: ${DSM_FULL_NAME}`}
              />

              {/* -------- bloco "Curso ativo" com switch (checkbox CSS) */}
              <div className={styles.activeBox}>
                <div className={styles.activeTexts}>
                  <strong className={styles.activeTitle}>Curso ativo</strong>
                  <span className={styles.activeHint}>
                    {edit.active
                      ? 'Habilitado no registro institucional.'
                      : 'Desabilitado no registro institucional.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  className={styles.switch}
                  checked={edit.active}
                  onChange={(e) =>
                    setEdit((f) => ({ ...f, active: e.target.checked }))
                  }
                  aria-label="Curso ativo"
                />
              </div>

              <div className={styles.panelActions}>
                <Button
                  type="submit"
                  icon={<FiCheck aria-hidden="true" />}
                  disabled={!edit.code.trim() || !edit.name.trim()}
                >
                  Salvar alterações
                </Button>
                <Button variant="secondary" onClick={cancelEdit}>
                  Cancelar edição
                </Button>
              </div>
            </form>
          </aside>
        )}
      </div>

      {/* ---------------------------------- modal de cadastro */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cadastrar curso"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!form.name.trim() || !form.code.trim()}>
              Cadastrar
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            label="Nome do curso"
            required
            id="curso-novo-nome"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ex.: Análise e Desenvolvimento de Sistemas"
          />
          <TextField
            label="Código"
            required
            id="curso-novo-codigo"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="Ex.: ADS"
            hint="Sigla curta usada nos filtros e rótulos."
          />
          <Select
            label="Turno"
            value={form.shift}
            onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))}
          >
            <option value="Integral">Integral</option>
            <option value="Matutino">Matutino</option>
            <option value="Noturno">Noturno</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
}
