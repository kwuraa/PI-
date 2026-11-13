/**
 * PI² — Publicação de projeto (rota "/aluno/novo").
 * -----------------------------------------------------------------------------
 * Protótipo "Publicação de projeto" (mockup 03 · desktop). Briefing: a entrega
 * do aluno é feita APENAS com 3 links (GitHub, Live Preview e Documentação /
 * Portfólio) — sem upload de PDF e sem notas numéricas. Ao enviar, o projeto
 * entra em "análise" e o aluno é levado à confirmação "Enviado para análise!".
 *
 * O formulário abre com o rascunho EcoCampus ("Rascunho salvo às 09:38"),
 * como no protótipo. Desktop (≥1024px): 2 colunas — "Sobre o projeto" e
 * "Quem participa" à esquerda; materiais, visibilidade e ações à direita.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiSend } from 'react-icons/fi';

import Button from '../../components/ui/Button/Button.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import { COURSE_SHORT, getProjectBySlug, getTeam } from '../../mocks/projectsMock.js';
import styles from './NewProjectPage.module.css';

/** Rascunho em edição (protótipo: EcoCampus — ver mockup "Publicação"). */
const DRAFT = getProjectBySlug('ecocampus');
const DRAFT_TEAM = getTeam(DRAFT);

/** Hora do rascunho salvo exibida no chip do cabeçalho (copy do mockup). */
const DRAFT_SAVED_AT = 'Rascunho salvo às 09:38';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState(DRAFT?.title ?? '');
  const [members, setMembers] = useState(DRAFT_TEAM?.members.join('; ') ?? '');
  const [description, setDescription] = useState(DRAFT?.description ?? '');
  const [visibility, setVisibility] = useState('comunidade');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Protótipo: envio simulado → confirmação de envio do projeto em análise.
    navigate(`/aluno/status/${DRAFT?.slug ?? 'ecocampus'}?enviado=1`);
  };

  /** Adiciona mais um slot de integrante ("+ Adicionar… por e-mail"). */
  const handleAddMember = () => {
    setMembers((current) =>
      current.trim() && !current.trim().endsWith(';')
        ? `${current.trim()}; `
        : current
    );
  };

  return (
    <div className={styles.page}>
      {/* ------------------------------------------------------- hero */}
      <header className={styles.hero}>
        <div className={styles.heroTexts}>
          <h1 className={styles.heroTitle}>Sua ideia merece ser compartilhada.</h1>
          <p className={styles.heroLead}>
            Preencha os dados e envie ao seu orientador. Os campos com * são
            obrigatórios.
          </p>
        </div>
        <span className={styles.draftChip}>{DRAFT_SAVED_AT}</span>
      </header>

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
            />

            <div className={styles.row}>
              <Select label="Curso" defaultValue="dsm" required>
                <option value="dsm">{COURSE_SHORT}</option>
              </Select>
              <Select label="Tipo de projeto" defaultValue="pi" required>
                <option value="pi">Projeto integrador</option>
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
              />
              <span className={styles.counter}>
                {description.length} / 2.000 caracteres
              </span>
            </label>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Quem participa</h2>
            <TextField
              label="Integrantes"
              required
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              hint="Você é a responsável pelo envio deste projeto."
            />
            <button
              type="button"
              className={styles.addMember}
              onClick={handleAddMember}
            >
              + Adicionar integrante por e-mail
            </button>
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

            <TextField
              label="Repositório GitHub"
              type="url"
              inputMode="url"
              placeholder="https://github.com/eco-campus"
            />
            <TextField
              label="Live Preview / Deploy"
              type="url"
              inputMode="url"
              placeholder="https://ecocampus.app"
            />
            <TextField
              label="Documentação / Portfólio"
              type="url"
              inputMode="url"
              placeholder="https://eco-campus.vercel.app"
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
