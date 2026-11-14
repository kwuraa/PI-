/**
 * PI² — Meus critérios (rota "/painel/criterios", exclusiva do professor).
 * -----------------------------------------------------------------------------
 * Mockup 05 · "Critérios de avaliação — Meus critérios": tela em DUAS colunas
 * no desktop (empilhada no mobile) com
 *  • topo — h1 "Meus critérios" + lead "Organize a avaliação da sua disciplina.";
 *  • callout âmbar — avisa que os critérios gerais vêm da coordenação e são
 *    somente leitura (nomes, pesos e descrições não mudam pelo professor);
 *  • coluna principal — card "Critérios gerais · Total 100%" (Documentação 40%,
 *    Apresentação 30% e Código 30%, todos com cadeado) e card "Específicos da
 *    disciplina" (Select da disciplina, nota sobre a média ponderada, itens
 *    "Testes automatizados" e "Versionamento" com lápis à direita e botão
 *    "+ Novo critério");
 *  • coluna lateral — card "Novo critério" (badge "Rascunho" + formulário
 *    local: Nome do critério, Peso, Descrição, nota "Aplicado à nota de
 *    Código…" e os botões "Salvar critério" / "Cancelar").
 *
 * SEM BACKEND: tudo vive em `useState`. O formulário abre com o rascunho do
 * mockup; "Salvar critério" acrescenta o item à lista de específicos (ou
 * substitui o item quando o lápis o carregou para edição) e limpa os campos,
 * "Cancelar" descarta o rascunho e "+ Novo critério" zera o formulário para
 * o próximo cadastro. RBAC: RequireRole roles={['professor']} no App.jsx.
 * Imagens do projeto: FORA DE ESCOPO (item 16).
 */
import { useRef, useState } from 'react';
import { FiCheck, FiEdit3, FiLock, FiPlus } from 'react-icons/fi';

import Badge from '../../components/ui/Badge/Badge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Card from '../../components/ui/Card/Card.jsx';
import Select from '../../components/ui/Select/Select.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import styles from './CriteriosPage.module.css';

/** Critérios gerais — definidos pela coordenação: aqui são só leitura. */
const CRITERIOS_GERAIS = [
  {
    nome: 'Documentação',
    peso: 40,
    descricao: 'Clareza, metodologia e registro dos resultados.',
  },
  {
    nome: 'Apresentação',
    peso: 30,
    descricao: 'Domínio do tema e comunicação da equipe.',
  },
  {
    nome: 'Código',
    peso: 30,
    descricao: 'Funcionamento e qualidade da implementação.',
  },
];

/** Critérios específicos já cadastrados (estado inicial da disciplina). */
const ESPECIFICOS_INICIAIS = [
  {
    id: 'testes',
    nome: 'Testes automatizados',
    peso: 2,
    descricao: 'Cobertura dos fluxos principais e evidências de execução.',
  },
  {
    id: 'versionamento',
    nome: 'Versionamento',
    peso: 1,
    descricao: 'Histórico de commits e organização do repositório.',
  },
];

/** Rascunho inicial do formulário = campos já preenchidos no mockup. */
const RASCUNHO_INICIAL = {
  nome: 'Qualidade do código',
  peso: '2',
  descricao: 'Avaliar legibilidade, organização e aplicação de boas práticas no código.',
};

export default function CriteriosPage() {
  // Lista exibida em "Específicos da disciplina" (cresce ao salvar).
  const [especificos, setEspecificos] = useState(ESPECIFICOS_INICIAIS);
  // Conteúdo atual do card "Novo critério".
  const [rascunho, setRascunho] = useState(RASCUNHO_INICIAL);
  // Id do item carregado pelo lápis (null = cadastro novo).
  const [editandoId, setEditandoId] = useState(null);
  // Sequência simples para as chaves da lista (sem backend, sem id real).
  const seq = useRef(0);

  /** Atualiza um campo do rascunho (curried: onChange do input/textarea). */
  const alterarCampo = (campo) => (event) => {
    const { value } = event.target;
    setRascunho((prev) => ({ ...prev, [campo]: value }));
  };

  /** Zera o formulário e sai do modo de edição. */
  const limpar = () => {
    setRascunho({ nome: '', peso: '', descricao: '' });
    setEditandoId(null);
  };

  /**
   * Salva o rascunho: substitui o item editado ou acrescenta um novo ao fim
   * da lista "Específicos da disciplina" e limpa os campos.
   */
  const salvar = (event) => {
    event.preventDefault();
    const nome = rascunho.nome.trim();
    const descricao = rascunho.descricao.trim();
    const peso = Number(rascunho.peso);
    if (!nome || !descricao || !Number.isFinite(peso) || peso < 1) return;

    setEspecificos((prev) => {
      if (editandoId) {
        return prev.map((item) =>
          item.id === editandoId ? { ...item, nome, peso, descricao } : item
        );
      }
      seq.current += 1;
      return [...prev, { id: `criterio-${seq.current}`, nome, peso, descricao }];
    });
    limpar();
  };

  /** Lápis: carrega o critério no formulário para editar (ou cadastrar). */
  const editar = (item) => {
    setEditandoId(item.id);
    setRascunho({
      nome: item.nome,
      peso: String(item.peso),
      descricao: item.descricao,
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meus critérios</h1>
        <p className={styles.lead}>Organize a avaliação da sua disciplina.</p>
      </header>

      {/* -------------------------------------- callout âmbar (leitura) */}
      <aside className={styles.callout} role="note">
        <FiLock className={styles.calloutIcon} aria-hidden="true" />
        <div className={styles.calloutBody}>
          <p className={styles.calloutTitle}>
            Critérios gerais definidos pelo coordenador
          </p>
          <p className={styles.calloutText}>
            Somente leitura. Os nomes, pesos e descrições não podem ser
            alterados pelo professor.
          </p>
        </div>
      </aside>

      <div className={styles.grid}>
        {/* ------------------------------------ coluna principal */}
        <div className={styles.main}>
          <Card padding="lg" className={styles.block}>
            <h2 className={styles.blockTitle}>Critérios gerais · Total 100%</h2>
            <ul className={styles.criteriaList}>
              {CRITERIOS_GERAIS.map((criterio) => (
                <li key={criterio.nome} className={styles.criterion}>
                  <div className={styles.criterionHead}>
                    <FiLock
                      className={styles.lockIcon}
                      aria-hidden="true"
                    />
                    <h3 className={styles.criterionName}>{criterio.nome}</h3>
                    <Badge>{criterio.peso}%</Badge>
                  </div>
                  <p className={styles.criterionText}>{criterio.descricao}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg" className={styles.block}>
            <h2 className={styles.blockTitle}>Específicos da disciplina</h2>

            <Select label="Disciplina" defaultValue="projeto-integrador-ii">
              <option value="projeto-integrador-ii">
                Projeto Integrador II
              </option>
            </Select>

            <p className={styles.note}>
              Estes critérios compõem a nota de Código pela média ponderada dos
              pesos. Não alteram os pesos gerais.
            </p>

            <ul className={styles.criteriaList}>
              {especificos.map((criterio) => (
                <li key={criterio.id} className={styles.criterion}>
                  <div className={styles.criterionHead}>
                    <h3 className={styles.criterionName}>{criterio.nome}</h3>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => editar(criterio)}
                      aria-label={`Editar critério ${criterio.nome}`}
                    >
                      <FiEdit3 aria-hidden="true" />
                    </button>
                  </div>
                  <Badge>Peso {criterio.peso}</Badge>
                  <p className={styles.criterionText}>{criterio.descricao}</p>
                </li>
              ))}
            </ul>

            <div>
              <Button
                variant="secondary"
                icon={<FiPlus size={16} aria-hidden="true" />}
                onClick={limpar}
              >
                Novo critério
              </Button>
            </div>
          </Card>
        </div>

        {/* ------------------------------------ coluna do formulário */}
        <Card padding="lg" className={styles.formCard}>
          <h2 className={styles.blockTitle}>Novo critério</h2>
          <div className={styles.formBadge}>
            <Badge>Rascunho</Badge>
          </div>

          <form className={styles.form} onSubmit={salvar}>
            <TextField
              label="Nome do critério"
              required
              value={rascunho.nome}
              onChange={alterarCampo('nome')}
            />
            <TextField
              label="Peso"
              required
              type="number"
              min="1"
              inputMode="numeric"
              value={rascunho.peso}
              onChange={alterarCampo('peso')}
            />
            <label className={styles.textareaField} htmlFor="descricao-criterio">
              <span className={styles.textareaLabel}>Descrição *</span>
              <textarea
                id="descricao-criterio"
                className={styles.textarea}
                required
                rows={4}
                value={rascunho.descricao}
                onChange={alterarCampo('descricao')}
              />
            </label>

            <p className={styles.formNote}>
              Aplicado à nota de Código nesta disciplina após salvar.
            </p>

            <div className={styles.formActions}>
              <Button
                type="submit"
                icon={<FiCheck size={18} aria-hidden="true" />}
              >
                Salvar critério
              </Button>
              <Button variant="secondary" type="button" onClick={limpar}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
