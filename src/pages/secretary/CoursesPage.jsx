/**
 * PI² — Cursos da instituição (rota "/secretaria/cursos", da secretaria).
 * -----------------------------------------------------------------------------
 * Cadastro institucional de cursos: o DSM já vem cadastrado (mock) e a
 * secretaria pode cadastrar novos cursos pelo modal — formulário simulado,
 * sem backend.
 */
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE } from '../../mocks/projectsMock.js';
import styles from './CoursesPage.module.css';

/** Cursos iniciais (mock DSM-only). */
const INITIAL_COURSES = [
  {
    id: 'curs-dsm',
    name: COURSE,
    code: 'DSM',
    shift: 'Integral',
    status: 'ativo',
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', shift: 'Noturno' });

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
      },
    ]);
    setForm({ name: '', code: '', shift: 'Noturno' });
    setOpen(false);
  };

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Cursos"
        subtitle="Cadastro institucional de cursos da faculdade."
        action={
          <button type="button" className={styles.newButton} onClick={() => setOpen(true)}>
            <FiPlus aria-hidden="true" />
            Novo
          </button>
        }
      />

      <div className={styles.list}>
        {courses.map((course) => (
          <Card key={course.id} padding="md" className={styles.card}>
            <div className={styles.cardTop}>
              <Badge tone={course.status === 'ativo' ? 'success' : 'neutral'}>
                {course.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className={styles.code}>{course.code}</span>
            </div>
            <h3 className={styles.name}>{course.name}</h3>
            <p className={styles.meta}>Turno {course.shift} · Cadastro da secretaria</p>
            {course.code === 'DSM' && (
              <p className={styles.lockedNote}>
                Curso ativo do PI² — todos os projetos e grupos pertencem ao DSM.
              </p>
            )}
          </Card>
        ))}
      </div>

      <p className={styles.footnote}>
        O cadastro de cursos é exclusivo da secretaria. Alterações aparecem
        imediatamente nas telas do sistema.
      </p>

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
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ex.: Análise e Desenvolvimento de Sistemas"
          />
          <TextField
            label="Código"
            required
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
