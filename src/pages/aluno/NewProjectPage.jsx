/**
 * PI² — Publicação de projeto (rota "/aluno/novo").
 * -----------------------------------------------------------------------------
 * Briefing: a entrega do aluno é feita APENAS com 3 links
 * (GitHub, Live Preview e Documentação/Portfólio) — sem upload de PDF e
 * sem notas numéricas. Ao enviar, o projeto entra em "análise" e o aluno
 * é levado ao acompanhamento.
 * Desktop (≥1024px): formulário em 2 colunas — "Sobre o projeto" e
 * "Quem participa" à esquerda; materiais, visibilidade e ações à direita
 * (protótipo "Publicação de projeto").
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiSend } from 'react-icons/fi';

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
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('comunidade');

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
        {/* --------------------------------------- coluna principal */}
        <div className={styles.mainCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Sobre o projeto</h2>

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
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte o problema, a solução e o público do projeto…"
              />
              <span className={styles.counter}>
                {description.length} / 2.000 caracteres
              </span>
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
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Quem participa</h2>
            <TextField
              label="Integrantes"
              required
              placeholder="Ex.: Ana Costa; Lucas Silva"
              hint="Você é a responsável pelo envio deste projeto."
            />
            <Select label="Orientador" required defaultValue="rafael">
              <option value="rafael">Prof. Rafael Martins</option>
              <option value="marta">Profa. Marta Campos</option>
            </Select>
          </section>
        </div>

        {/* ----------------------------------------- coluna lateral */}
        <aside className={styles.aside}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Materiais e submissão</h2>
            <p className={styles.cardHint}>
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

          <fieldset className={`${styles.card} ${styles.visField}`}>
            <legend className={styles.cardTitle}>Quem poderá ver?</legend>
            <label
              className={`${styles.visOption} ${
                visibility === 'comunidade' ? styles.visActive : ''
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility === 'comunidade'}
                onChange={() => setVisibility('comunidade')}
              />
              <span className={styles.visText}>
                <strong>Comunidade acadêmica</strong>
                <span>Disponível para alunos e professores.</span>
              </span>
            </label>
            <label
              className={`${styles.visOption} ${
                visibility === 'equipe' ? styles.visActive : ''
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility === 'equipe'}
                onChange={() => setVisibility('equipe')}
              />
              <span className={styles.visText}>
                <strong>Somente equipe e orientador</strong>
                <span>Acesso restrito aos participantes.</span>
              </span>
            </label>
          </fieldset>

          <p className={styles.info}>
            <FiInfo size={18} aria-hidden="true" />
            <span className={styles.infoText}>
              <strong>A publicação passa por revisão</strong>
              Seu orientador será notificado. O projeto só ficará disponível
              após a aprovação.
            </span>
          </p>

          <div className={styles.actions}>
            <Button
              size="lg"
              type="submit"
              icon={<FiSend aria-hidden="true" />}
              disabled={!title.trim()}
            >
              Enviar para análise
            </Button>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => navigate('/aluno')}
            >
              Salvar rascunho
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}
