/**
 * PI² — Publicação de projeto (rota "/aluno/novo").
 * -----------------------------------------------------------------------------
 * Briefing: a entrega do aluno é feita APENAS com 3 links
 * (GitHub, Live Preview e Documentação/Portfólio) — sem upload de PDF e
 * sem notas numéricas. Ao enviar, o projeto entra em "análise" e o aluno
 * é levado ao acompanhamento.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';

import Button from '../../components/ui/Button/Button.jsx';
import FilterChips from '../../components/ui/FilterChips/FilterChips.jsx';
import SectionHeader from '../../components/ui/SectionHeader/SectionHeader.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE, SEMESTERS, TECHNOLOGIES } from '../../mocks/projectsMock.js';
import styles from './NewProjectPage.module.css';

const TECH_OPTIONS = TECHNOLOGIES.map((tech) => ({ value: tech, label: tech }));

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [techs, setTechs] = useState([]);
  const [title, setTitle] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Protótipo: envio simulado → acompanha a análise do projeto em análise.
    navigate('/aluno/status/biblioteca-conectada?enviado=1');
  };

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Novo projeto integrador"
        subtitle={`Entrega do ${COURSE}. Envie os links da sua equipe para análise pelo orientador.`}
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Título do projeto"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Rota Acessível: um campus para todos"
        />

        <div className={styles.row}>
          <Select label="Tipo" defaultValue="pi" required>
            <option value="pi">Projeto integrador</option>
          </Select>
          <Select label="Semestre" required defaultValue={2}>
            {SEMESTERS.map((n) => (
              <option key={n} value={n}>
                {n}º semestre
              </option>
            ))}
          </Select>
        </div>

        <label className={styles.textareaField}>
          <span className={styles.textareaLabel}>Descrição *</span>
          <textarea
            className={styles.textarea}
            required
            rows={5}
            placeholder="Conte o problema, a solução e o público do projeto…"
          />
        </label>

        <div className={styles.techsField}>
          <span className={styles.textareaLabel}>Tecnologias</span>
          <FilterChips
            options={TECH_OPTIONS}
            value={techs}
            onChange={setTechs}
            multiple
            clearLabel="Nenhuma"
          />
        </div>

        {/* ---------------------- os 3 links da entrega (briefing) */}
        <section className={styles.linksBlock}>
          <h2 className={styles.linksTitle}>Links da entrega</h2>
          <p className={styles.linksHint}>
            A entrega é feita somente por links — não envie arquivos PDF.
          </p>

          <TextField
            label="Repositório GitHub"
            type="url"
            required
            inputMode="url"
            placeholder="https://github.com/equipe/projeto"
            hint="Código-fonte versionado da equipe."
          />
          <TextField
            label="Live Preview"
            type="url"
            required
            inputMode="url"
            placeholder="https://projeto.vercel.app"
            hint="Versão navegável do projeto."
          />
          <TextField
            label="Documentação / Portfólio"
            type="url"
            required
            inputMode="url"
            placeholder="https://notion.com/equipe/documentacao"
            hint="Relatório, processo e decisões de projeto."
          />
        </section>

        <div className={styles.actions}>
          <Button variant="secondary" size="lg" type="button" onClick={() => navigate('/aluno')}>
            Salvar rascunho
          </Button>
          <Button
            size="lg"
            type="submit"
            icon={<FiSend aria-hidden="true" />}
            disabled={!title.trim()}
          >
            Enviar para análise
          </Button>
        </div>
      </form>
    </div>
  );
}
